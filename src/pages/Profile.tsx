import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  Edit3,
  Save,
  X,
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = () => {
    toast({
      title: 'Profile updated!',
      description: 'Your changes have been saved successfully.',
    });
    setIsEditing(false);
  };

  const profileFields = [
    { icon: User, label: 'Full Name', value: user?.name, editable: false },
    { icon: Mail, label: 'Email', value: user?.email, editable: false },
    { icon: Building, label: 'Department', value: user?.department, editable: false },
    { icon: Briefcase, label: 'Position', value: user?.position, editable: false },
    { icon: Calendar, label: 'Join Date', value: user?.joinDate, editable: false },
    { icon: Phone, label: 'Phone', value: formData.phone, editable: true, key: 'phone' },
    { icon: MapPin, label: 'Address', value: formData.address, editable: true, key: 'address' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} variant="gradient" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="gradient-primary p-8 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-background flex items-center justify-center text-4xl font-bold text-primary shadow-lg">
                {user?.name.charAt(0)}
              </div>
              <div className="text-primary-foreground">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="opacity-90">{user?.position}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/20 backdrop-blur-sm text-sm">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {user?.role === 'admin' ? 'HR Administrator' : 'Employee'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {profileFields.map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                    <field.icon className="w-4 h-4" />
                    {field.label}
                  </Label>
                  {isEditing && field.editable && field.key ? (
                    <Input
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.key as string]: e.target.value })
                      }
                      className="h-12"
                    />
                  ) : (
                    <p className="font-medium text-lg py-2">
                      {field.value || <span className="text-muted-foreground">Not provided</span>}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Employee ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-semibold text-lg mb-4">Employee ID</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold">{user?.employeeId}</p>
              <p className="text-sm text-muted-foreground">Your unique employee identifier</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
