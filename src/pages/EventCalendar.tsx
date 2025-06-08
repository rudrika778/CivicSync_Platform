import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, UserPlus } from 'lucide-react';
import Layout from '../components/Layout';
import { useStore } from '../store/useStore';
import { format, parseISO, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

export default function EventCalendar() {
  const { events, registerForEvent } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      format(parseISO(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const handleRegister = (eventId: string) => {
    registerForEvent(eventId);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cleanup': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'awareness': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Calendar</h1>
            <p className="text-gray-600">Join community events and volunteer opportunities</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-4">
                {/* Empty cells for days before month start */}
                {Array.from({ length: getDay(monthStart) }).map((_, index) => (
                  <div key={index} className="h-24"></div>
                ))}
                
                {/* Month days */}
                {monthDays.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <div key={day.toString()} className={`h-24 border border-gray-200 rounded-lg p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'} transition-colors`}>
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.type)}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid lg:grid-cols-2 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>

                  {event.volunteerSlots > 0 && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>
                        {event.registeredVolunteers} / {event.volunteerSlots} volunteers registered
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((event.registeredVolunteers / event.volunteerSlots) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {event.volunteerSlots > 0 && event.registeredVolunteers < event.volunteerSlots && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Register as Volunteer</span>
                  </button>
                )}

                {event.volunteerSlots > 0 && event.registeredVolunteers >= event.volunteerSlots && (
                  <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg text-center font-semibold">
                    Event is Full
                  </div>
                )}

                {event.volunteerSlots === 0 && (
                  <div className="w-full bg-green-100 text-green-700 py-3 rounded-lg text-center font-semibold">
                    Open Event - No Registration Required
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
            <p className="text-gray-600">Check back later for upcoming community events and volunteer opportunities.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}