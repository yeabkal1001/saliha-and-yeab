import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Phone, MapPin, Store, Save } from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    bio: 'Passionate seller with a focus on quality products and excellent customer service.',
    storeName: 'Your Store',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-blue-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">My Profile</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white border-blue-200">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-2xl">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-2">{formData.name}</h2>
                  <p className="text-gray-600 mb-4">{formData.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Store size={16} />
                      <span>{formData.storeName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={16} />
                      <span>Member since 2024</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Seller Stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Products</p>
                        <p className="text-blue-600">12</p>
                      </div>
                      <div>
                        <p className="font-medium">Sales</p>
                        <p className="text-blue-600">48</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="text-blue-600" size={24} />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                          id="storeName"
                          value={formData.storeName}
                          onChange={(e) => handleChange('storeName', e.target.value)}
                          placeholder="Enter your store name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Tell us about yourself and your store"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        type="url"
                        value={formData.avatar}
                        onChange={(e) => handleChange('avatar', e.target.value)}
                        placeholder="Enter avatar image URL"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      size="lg"
                    >
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;