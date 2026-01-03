import { useState } from 'react';
import { Camera, Save, X, Edit2 } from 'lucide-react';
import EmployeeLayout from '@/components/Layout/EmployeeLayout';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    employeeId: 'EMP-001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    department: 'Engineering',
    designation: 'Senior Developer',
    joiningDate: 'January 15, 2022',
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto space-y-6 fade-in">
        {/* Profile Header */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-4 border-card shadow-lg">
                JD
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.designation}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {profile.department}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  ID: {profile.employeeId}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn-secondary ${isEditing ? 'bg-destructive/10 text-destructive' : ''}`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Personal Details</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="form-input mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="form-input mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="form-input mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    className="form-input mt-1"
                    rows={2}
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{profile.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="dashboard-card">
            <h3 className="section-title mb-6">Job Details</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground">Employee ID</label>
                <p className="text-foreground font-medium mt-1">{profile.employeeId}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Department</label>
                <p className="text-foreground font-medium mt-1">{profile.department}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Designation</label>
                <p className="text-foreground font-medium mt-1">{profile.designation}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Joining Date</label>
                <p className="text-foreground font-medium mt-1">{profile.joiningDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default Profile;
