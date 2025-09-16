import mongoose, { Schema, Document } from 'mongoose';

export interface IPickupProgress {
  pickupPointId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  startTime?: Date;
  completionTime?: Date;
  notes?: string;
  actualVolume?: number;
  issues?: string[];
}

export interface IAssignment extends Document {
  route: mongoose.Types.ObjectId;
  operator: mongoose.Types.ObjectId;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pickupProgress: IPickupProgress[];
  totalDistance?: number;
  totalDuration?: number;
  fuelUsed?: number;
  notes?: string;
  issues?: string[];
  vehicleInfo?: {
    id: string;
    type: string;
    capacity: number;
  };
  createdBy: mongoose.Types.ObjectId;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const PickupProgressSchema = new Schema({
  pickupPointId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'skipped'],
    default: 'pending'
  },
  startTime: {
    type: Date
  },
  completionTime: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  actualVolume: {
    type: Number,
    min: 0
  },
  issues: [{
    type: String,
    trim: true
  }]
});

const AssignmentSchema: Schema = new Schema({
  route: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Route reference is required']
  },
  operator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Operator reference is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'assigned'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  pickupProgress: [PickupProgressSchema],
  totalDistance: {
    type: Number,
    min: 0
  },
  totalDuration: {
    type: Number,
    min: 0
  },
  fuelUsed: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  issues: [{
    type: String,
    trim: true
  }],
  vehicleInfo: {
    id: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      trim: true
    },
    capacity: {
      type: Number,
      min: 0
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Create indexes for better performance
AssignmentSchema.index({ operator: 1, scheduledDate: -1 });
AssignmentSchema.index({ route: 1 });
AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ scheduledDate: -1 });
AssignmentSchema.index({ createdBy: 1 });


const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;