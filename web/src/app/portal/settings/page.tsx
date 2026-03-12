'use client';

import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { getCurrentUser } from "@/lib/auth"

export default function PortalSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const modal = useModal()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    reservationReminders: true,
    paymentConfirmations: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          const nameParts = ((currentUser as any).name || '').split(' ');
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: (currentUser as any).email || '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }
    loadUser()
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim()
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
        modal.showAlert("Success", "Profile updated successfully! Your changes are now reflected throughout the site.", "success")
      } else {
        modal.showAlert("Error", data.error || "Failed to update profile", "error")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      modal.showAlert("Error", "Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      modal.showAlert("Error", "Passwords do not match", "error");
      return;
    }
    
    if (formData.newPassword.length < 8) {
      modal.showAlert("Error", "Password must be at least 8 characters long", "error");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        modal.showAlert("Success", "Password changed successfully!", "success");
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        modal.showAlert("Error", data.error || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Password change error:", error);
      modal.showAlert("Error", "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Custom Modal */}
      <Modal
        isOpen={modal.modal.isOpen}
        onClose={modal.closeModal}
        title={modal.modal.title}
        message={modal.modal.message}
        type={modal.modal.type}
        onConfirm={modal.modal.onConfirm}
        confirmText={modal.modal.confirmText}
        cancelText={modal.modal.cancelText}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account & Settings</h1>
        <p className="mt-1 text-sm text-slate-700">Manage your profile, security, and preferences</p>
      </header>

      {/* Your Account Section */}
      <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your Account</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-xl font-bold text-white">
              {(user?.name || 'U').toString().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-sm text-slate-700">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button className="text-sm font-medium text-rose-600 hover:text-rose-700">Edit</button>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 sm:w-auto transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 sm:w-auto transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences Section */}
      <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
        
        <div className="space-y-4">
          {[
            { key: 'reservationReminders', label: 'Reservation Reminders', description: 'Get notified about upcoming reservations' },
            { key: 'paymentConfirmations', label: 'Payment Confirmations', description: 'Receive payment receipts and confirmations' },
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via text message' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-b-0">
              <div>
                <p className="font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-700">{description}</p>
              </div>
              <button
                onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Payment Methods Section */}
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Linked Payment Methods</h2>
        
        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
              <div className="text-3xl mb-3">💳</div>
              <p className="text-slate-600 mb-2">No payment methods yet</p>
              <p className="text-sm text-slate-500">Add a payment method to make reservations faster</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">�</div>
                  <div>
                    <p className="font-medium text-slate-900">{method.brand} •••• {method.last4}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => modal.showAlert("Info", "Payment method addition coming soon!", "alert")}
          className="mt-4 w-full rounded-lg border border-rose-600 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          + Add Payment Method
        </button>
      </div>
    </div>
  );
}

