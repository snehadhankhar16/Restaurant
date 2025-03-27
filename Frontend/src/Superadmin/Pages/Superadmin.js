import React from 'react';
import AddUser from '../Components/AddUser';
import Users from '../Components/Users';

const Superadmin = () => {
  return (
    <div>
      <Users/>
      <AddUser/>
    </div>
  );
};

export default Superadmin;