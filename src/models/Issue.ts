import mongoose, { Document, Model, Schema } from "mongoose";

export type IssueStatus = "open" | "in_progress" | "closed";
export type IssuePriority = "low" | "medium" | "high";

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignee: {
      type: String,
      default: "",
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);

// Compound index: most common filter combination (status + priority)
IssueSchema.index({ status: 1, priority: 1 });

// Text index on title for search
IssueSchema.index({ title: "text" });

// Index on dueDate for overdue queries
IssueSchema.index({ dueDate: 1 });

// Index on createdAt for sort (newest/oldest)
IssueSchema.index({ createdAt: -1 });

// Index on createdBy for user-specific queries
IssueSchema.index({ createdBy: 1 });

const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema);

export default Issue;
