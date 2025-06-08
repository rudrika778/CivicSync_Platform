import { create } from 'zustand';
import { format } from 'date-fns';

export interface Issue {
  id: string;
  type: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'in-progress' | 'resolved';
  upvotes: number;
  reportedBy: string;
  reportedAt: string;
  adminRemarks?: string;
  hasUpvoted?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  volunteerSlots: number;
  registeredVolunteers: number;
  type: 'cleanup' | 'meeting' | 'awareness' | 'other';
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isAdmin?: boolean;
}

interface AppState {
  issues: Issue[];
  events: Event[];
  chatMessages: ChatMessage[];
  addIssue: (issue: Omit<Issue, 'id' | 'reportedAt' | 'upvotes' | 'hasUpvoted'>) => void;
  updateIssueStatus: (id: string, status: Issue['status'], remarks?: string) => void;
  upvoteIssue: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  registerForEvent: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  issues: [
    {
      id: '1',
      type: 'Potholes',
      description: 'Multiple deep potholes on Hoshangabad Road near Ayodhya Bypass causing severe traffic congestion and vehicle damage',
      location: { lat: 23.2599, lng: 77.4126, address: 'Hoshangabad Road, Near Ayodhya Bypass, Bhopal' },
      status: 'pending',
      upvotes: 47,
      reportedBy: 'Rajesh Kumar',
      reportedAt: format(new Date(Date.now() - 86400000), 'MMM dd, yyyy'),
      hasUpvoted: false
    },
    {
      id: '2',
      type: 'Water Leakage',
      description: 'Major water pipeline burst near Shahpura Lake causing water wastage and road flooding',
      location: { lat: 23.2156, lng: 77.4304, address: 'Shahpura Lake Road, Shahpura, Bhopal' },
      status: 'in-progress',
      upvotes: 32,
      reportedBy: 'Priya Sharma',
      reportedAt: format(new Date(Date.now() - 172800000), 'MMM dd, yyyy'),
      adminRemarks: 'BMC water department team dispatched. Repair work in progress.',
      hasUpvoted: true
    },
    {
      id: '3',
      type: 'Garbage Collection',
      description: 'Garbage not collected for 5 days in Arera Colony Sector C, creating unhygienic conditions and foul smell',
      location: { lat: 23.2156, lng: 77.4304, address: 'Arera Colony Sector C, E-7, Bhopal' },
      status: 'pending',
      upvotes: 28,
      reportedBy: 'Amit Verma',
      reportedAt: format(new Date(Date.now() - 259200000), 'MMM dd, yyyy'),
      hasUpvoted: false
    },
    {
      id: '4',
      type: 'Streetlight Issue',
      description: 'All street lights non-functional on VIP Road from Lalghati to Roshanpura, creating safety concerns',
      location: { lat: 23.2599, lng: 77.4126, address: 'VIP Road, Lalghati to Roshanpura, Bhopal' },
      status: 'resolved',
      upvotes: 19,
      reportedBy: 'Sunita Jain',
      reportedAt: format(new Date(Date.now() - 432000000), 'MMM dd, yyyy'),
      adminRemarks: 'All street lights repaired and tested. LED lights installed for better illumination.',
      hasUpvoted: false
    },
    {
      id: '5',
      type: 'Sewer Overflow',
      description: 'Sewage overflow near Upper Lake causing environmental pollution and health hazards for morning walkers',
      location: { lat: 23.2599, lng: 77.4126, address: 'Upper Lake, Shyamla Hills, Bhopal' },
      status: 'in-progress',
      upvotes: 56,
      reportedBy: 'Dr. Mohan Gupta',
      reportedAt: format(new Date(Date.now() - 345600000), 'MMM dd, yyyy'),
      adminRemarks: 'Environmental team investigating. Temporary barriers installed.',
      hasUpvoted: true
    },
    {
      id: '6',
      type: 'Road Damage',
      description: 'Severe road cracks and uneven surface on Link Road No. 1 in New Market area affecting daily commute',
      location: { lat: 23.2599, lng: 77.4126, address: 'Link Road No. 1, New Market, Bhopal' },
      status: 'pending',
      upvotes: 23,
      reportedBy: 'Kavita Singh',
      reportedAt: format(new Date(Date.now() - 518400000), 'MMM dd, yyyy'),
      hasUpvoted: false
    },
    {
      id: '7',
      type: 'Tree Fall',
      description: 'Large banyan tree fallen on Berasia Road blocking traffic and posing danger to vehicles and pedestrians',
      location: { lat: 23.2599, lng: 77.4126, address: 'Berasia Road, Near Karond, Bhopal' },
      status: 'resolved',
      upvotes: 41,
      reportedBy: 'Ravi Patel',
      reportedAt: format(new Date(Date.now() - 604800000), 'MMM dd, yyyy'),
      adminRemarks: 'Tree removed by BMC disaster management team. Road cleared for traffic.',
      hasUpvoted: false
    },
    {
      id: '8',
      type: 'Open Wires',
      description: 'Exposed electrical wires hanging dangerously low near MP Nagar Zone 2 bus stop, risk of electrocution',
      location: { lat: 23.2599, lng: 77.4126, address: 'MP Nagar Zone 2, Bus Stop, Bhopal' },
      status: 'pending',
      upvotes: 35,
      reportedBy: 'Anita Dubey',
      reportedAt: format(new Date(Date.now() - 691200000), 'MMM dd, yyyy'),
      hasUpvoted: false
    }
  ],
  
  events: [
    {
      id: '1',
      title: 'Upper Lake Cleanup Drive',
      description: 'Join us for a comprehensive cleanup of Upper Lake area to preserve Bhopal\'s natural heritage',
      date: format(new Date(Date.now() + 604800000), 'yyyy-MM-dd'),
      location: 'Upper Lake, Shyamla Hills, Bhopal',
      volunteerSlots: 100,
      registeredVolunteers: 67,
      type: 'cleanup'
    },
    {
      id: '2',
      title: 'Bhopal Municipal Corporation Monthly Meeting',
      description: 'Public meeting to discuss city development projects and citizen grievances',
      date: format(new Date(Date.now() + 1209600000), 'yyyy-MM-dd'),
      location: 'BMC Office, Arera Hills, Bhopal',
      volunteerSlots: 0,
      registeredVolunteers: 0,
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Road Safety Awareness Campaign',
      description: 'Educational program on traffic rules and road safety for Bhopal citizens',
      date: format(new Date(Date.now() + 1814400000), 'yyyy-MM-dd'),
      location: 'TT Nagar Stadium, Bhopal',
      volunteerSlots: 25,
      registeredVolunteers: 18,
      type: 'awareness'
    }
  ],
  
  chatMessages: [
    {
      id: '1',
      sender: 'RajeshBhopal',
      message: 'The potholes on Hoshangabad Road are getting worse every day. My car got damaged yesterday!',
      timestamp: format(new Date(Date.now() - 3600000), 'HH:mm')
    },
    {
      id: '2',
      sender: 'BMC Admin',
      message: 'We have received multiple reports about Hoshangabad Road. Road repair work will begin next week during non-peak hours.',
      timestamp: format(new Date(Date.now() - 1800000), 'HH:mm'),
      isAdmin: true
    },
    {
      id: '3',
      sender: 'PriyaArera',
      message: 'Great to see the water leakage issue near Shahpura Lake is being addressed quickly!',
      timestamp: format(new Date(Date.now() - 900000), 'HH:mm')
    },
    {
      id: '4',
      sender: 'AmitVerma',
      message: 'When will the garbage collection resume in Arera Colony? It\'s been 5 days now.',
      timestamp: format(new Date(Date.now() - 600000), 'HH:mm')
    }
  ],

  addIssue: (issue) => set((state) => ({
    issues: [...state.issues, {
      ...issue,
      id: Math.random().toString(36).substr(2, 9),
      reportedAt: format(new Date(), 'MMM dd, yyyy'),
      upvotes: 0,
      hasUpvoted: false
    }]
  })),

  updateIssueStatus: (id, status, remarks) => set((state) => ({
    issues: state.issues.map(issue => 
      issue.id === id 
        ? { ...issue, status, ...(remarks && { adminRemarks: remarks }) }
        : issue
    )
  })),

  upvoteIssue: (id) => set((state) => ({
    issues: state.issues.map(issue => 
      issue.id === id && !issue.hasUpvoted
        ? { ...issue, upvotes: issue.upvotes + 1, hasUpvoted: true }
        : issue
    )
  })),

  addEvent: (event) => set((state) => ({
    events: [...state.events, {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),

  registerForEvent: (id) => set((state) => ({
    events: state.events.map(event => 
      event.id === id && event.registeredVolunteers < event.volunteerSlots
        ? { ...event, registeredVolunteers: event.registeredVolunteers + 1 }
        : event
    )
  })),

  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: format(new Date(), 'HH:mm')
    }]
  }))
}));