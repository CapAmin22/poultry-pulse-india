
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First, get all users from auth.users (admin only can access this)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Transform and set the users data
      const formattedUsers = authUsers?.users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user',
        name: user.user_metadata?.full_name || 'No Name',
        phone: user.user_metadata?.phone_number || 'Not provided',
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        avatar_url: user.user_metadata?.avatar_url
      })) || [];
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "There was a problem retrieving user data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Update user metadata with new role
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      );
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));
      
      toast({
        title: "User role updated",
        description: "The user's role has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Failed to update user role",
        description: "There was a problem updating the user's role."
      });
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'view':
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        break;
      case 'suspend':
        // Placeholder for actual implementation
        toast({
          title: "User suspended",
          description: "The user account has been suspended.",
        });
        break;
      case 'delete':
        // Placeholder for actual implementation
        toast({
          variant: "destructive",
          title: "User deleted",
          description: "The user account has been deleted.",
        });
        break;
      default:
        break;
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search users by name or email..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="farmer">Farmers</SelectItem>
              <SelectItem value="financial">Financial Providers</SelectItem>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="distributor">Distributors</SelectItem>
              <SelectItem value="supplier">Suppliers</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5565c] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                            <AvatarFallback className="bg-[#f5565c] text-white">
                              {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={user.role} 
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="farmer">Farmer</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="processor">Processor</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="researcher">Researcher</SelectItem>
                            <SelectItem value="veterinarian">Veterinarian</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleUserAction('view', user.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.avatar_url} />
                                    <AvatarFallback className="bg-[#f5565c] text-white text-xl">
                                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium text-lg">{selectedUser.name}</h3>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                    <Badge variant="outline" className="mt-1">
                                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div>
                                    <p className="text-sm text-gray-500">Account Created</p>
                                    <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Last Sign In</p>
                                    <p>{selectedUser.last_sign_in ? new Date(selectedUser.last_sign_in).toLocaleDateString() : 'Never'}</p>
                                  </div>
                                </div>
                                
                                <div className="pt-4 flex gap-2 justify-end">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction('suspend', selectedUser.id)}
                                  >
                                    Suspend User
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleUserAction('delete', selectedUser.id)}
                                  >
                                    Delete User
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
