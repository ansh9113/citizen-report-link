import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Upload, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ComplaintMap from '@/components/Map/ComplaintMap';
import { useAuth } from '@/context/AuthContext';
import { complaintService } from '@/services/complaintService';
import { emailService } from '@/services/emailService';

interface ComplaintFormProps {
  onSubmit?: (complaint: any) => void;
  isSubmitting?: boolean;
}

const complaintTypes = [
  { value: 'road', label: 'Road Issues' },
  { value: 'water', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'streetlight', label: 'Street Lighting' },
  { value: 'drainage', label: 'Drainage & Sewage' },
  { value: 'garbage', label: 'Garbage Collection' },
  { value: 'others', label: 'Others' }
];

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    location: null as { lat: number; lng: number; address?: string } | null,
    photos: [] as File[]
  });

  const [showMap, setShowMap] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      location: { lat, lng, address }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 3) // Max 3 photos
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a complaint");
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.location) {
      toast.error("Please select a location on the map");
      return;
    }

    setIsSubmittingForm(true);

    try {
      // Create new complaint
      const newComplaint = await complaintService.createComplaint({
        userId: user.id,
        userName: user.name,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        location: formData.location,
        photos: [], // Simplify for now, handling files is complex without backend
      });

      onSubmit?.(newComplaint);

      toast.success(`Complaint Submitted! ID: ${newComplaint.id}`);

      // Send Email Notification
      try {
        const emailResponse = await emailService.sendComplaintConfirmation({
          to_name: user.name,
          to_email: user.email || '',
          complaint_id: newComplaint.id,
          complaint_title: newComplaint.title,
          complaint_status: newComplaint.status
        });

        if (emailResponse.status === 'mocked') {
          toast.info("Email simulated (Configure EmailJS for real emails)");
        } else {
          toast.success("Confirmation email sent successfully!");
        }
      } catch (emailError) {
        console.error("Failed to send email", emailError);
        toast.warning("Complaint submitted, but failed to send confirmation email.");
      }

      // Navigate to tracking page
      setTimeout(() => {
        navigate('/track');
      }, 4000);

    } catch (error: any) {
      toast.error("Submission Failed: " + error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your complaint has been saved as draft",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Submit New Complaint</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pothole on Main Street"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Issue Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <div className="flex flex-wrap gap-2">
                {priorityLevels.map((priority) => (
                  <Badge
                    key={priority.value}
                    variant={formData.priority === priority.value ? "default" : "secondary"}
                    className={`cursor-pointer transition-smooth ${formData.priority === priority.value ? 'ring-2 ring-primary' : ''
                      }`}
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as 'low' | 'medium' | 'high' }))}
                  >
                    {priority.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Location *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? 'Hide Map' : 'Select Location'}
                </Button>
              </div>

              {formData.location && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                    {formData.location.address && (
                      <><br />{formData.location.address}</>
                    )}
                  </p>
                </div>
              )}

              {showMap && (
                <div className="mt-4">
                  <ComplaintMap
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={formData.location}
                    height="300px"
                  />
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <Label>Photos (Optional - Max 3)</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    disabled={formData.photos.length >= 3}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.photos.length}/3 photos uploaded
                  </span>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmittingForm} className="gradient-primary">
                {isSubmittingForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmittingForm ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintForm;