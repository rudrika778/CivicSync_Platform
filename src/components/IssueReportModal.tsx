import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IssueForm {
  type: string;
  description: string;
  customType?: string;
}

const issueTypes = [
  'Potholes',
  'Garbage Collection',
  'Powercut',
  'Water Leakage',
  'Streetlight Issue',
  'Sewer Overflow',
  'Road Damage',
  'Tree Fall',
  'Open Wires',
  'Other'
];

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function IssueReportModal({ isOpen, onClose }: IssueReportModalProps) {
  const { register, handleSubmit, watch, reset } = useForm<IssueForm>();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // default to NYC
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addIssue = useStore((state) => state.addIssue);
  const { user } = useAuth();

  const watchType = watch('type');

  // Get user's location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setMapCenter(coords);
          setPosition(coords); // auto place marker
        },
        (err) => {
          console.error('Location error:', err.message);
        }
      );
    } else {
      console.warn('Geolocation not supported');
    }
  }, []);

  const onSubmit = async (data: IssueForm) => {
    if (!position) {
      alert('Please select a location on the map');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const issueType = data.type === 'Other' ? data.customType || 'Other' : data.type;

    addIssue({
      type: issueType,
      description: data.description,
      location: {
        lat: position[0],
        lng: position[1],
        address: `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`
      },
      status: 'pending',
      reportedBy: user?.name || 'Anonymous'
    });

    setIsSubmitting(false);
    reset();
    setPosition(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type *</label>
                <select
                  {...register('type', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select issue type</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {watchType === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specify Issue Type *</label>
                  <input
                    {...register('customType', { required: watchType === 'Other' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the issue type"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  {...register('description', { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Provide detailed description of the issue"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Location Selection</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {position
                        ? `Selected: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`
                        : 'Click on the map to pin the exact location of the issue'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pin Location on Map *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">
  *Detected location may not be 100% accurate on desktop. Please click on the map to mark the exact issue location.
          </p>


          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Report Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
