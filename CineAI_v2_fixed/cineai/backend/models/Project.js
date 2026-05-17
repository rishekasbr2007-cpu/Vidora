import mongoose from 'mongoose';

const clipSchema = new mongoose.Schema({
  id: String, type: String, name: String, src: String,
  track: String, startTime: Number, duration: Number,
  volume: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
  speed:   { type: Number, default: 1 },
  effects: [{ id: String, name: String, params: mongoose.Schema.Types.Mixed }],
  isAiGenerated: { type: Boolean, default: false },
  aiPrompt: String,
  linkedAudioId: String,
}, { _id: false });

const folderSchema = new mongoose.Schema({
  name: String, parentId: String,
}, { _id: true });

const projectSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId:    { type: String, default: 'root' },
  title:       { type: String, default: 'Untitled Project' },
  description: { type: String, default: '' },
  thumbnail:   { type: String, default: '' },
  resolution:  { type: String, default: '1920x1080' },
  frameRate:   { type: Number, default: 24 },
  clips:       [clipSchema],
  isPublished: { type: Boolean, default: false },
  isPublic:    { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags:        [String],
  duration:    { type: Number, default: 0 },
  code:        { type: String, default: 'cstdineshroshan' },
}, { timestamps: true });

export const Folder  = mongoose.model('Folder', folderSchema);
export default mongoose.model('Project', projectSchema);
