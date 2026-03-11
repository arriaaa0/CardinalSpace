'use client';

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

export default function PortalSettingsPage() {
  const [user, setUser] = useState<any>(null)
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

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', brand: 'Visa', last4: '4242' },
    { id: 2, type: 'gcash', label: 'GCash' }
  ]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          setFormData({
            firstName: (currentUser as any).name || '',
            lastName: '',
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password changed successfully');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully');
  };

  const handleAddPaymentMethod = () => {
    alert('Payment method addition coming soon');
  };

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white hover:bg-rose-700 sm:w-auto"
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white hover:bg-rose-700 sm:w-auto"
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
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {method.type === 'card' && (
                  <>
                    <div className="text-2xl">💳</div>
                    <div>
                      <p className="font-medium text-slate-900">{method.brand}</p>
                      <p className="text-sm text-slate-700">ending in {method.last4}</p>
                    </div>
                  </>
                )}
                {method.type === 'gcash' && (
                  <>
                    <div className="text-2xl">💙</div>
                    <div>
                      <p className="font-medium text-slate-900">{method.label}</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => handleRemovePaymentMethod(method.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddPaymentMethod}
          className="mt-4 w-full rounded-lg border border-rose-600 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          + Add Payment Method
        </button>
      </div>
    </div>
  );
}

