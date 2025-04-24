import React from 'react';
import { useRouter } from 'next/router';

/*const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();
    const userType = 1; // Replace this with actual user type fetching logic

    if (!allowedRoles.includes(userType)) {
      router.push('/not-authorized'); // Redirect if user type is not allowed
      return null;
    }

    return <WrappedComponent {...props} userType={userType} />;
  };
};

export default withRole;*/
