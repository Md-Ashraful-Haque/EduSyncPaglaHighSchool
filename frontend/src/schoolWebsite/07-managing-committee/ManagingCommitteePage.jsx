import React, { useState, useEffect } from 'react';
import ManagingCommitteeListView from './ManagingCommitteeContent'
// import ManagingCommitteeContent from './ManagingCommitteeContent'
const ManagingCommitteePage = ({ instituteId, apiBaseUrl = '/' }) => {
   

  return (
    <div className='bg-gray-50 w-full h-full'>
      {/* <ManagingCommitteeContent instituteId={1} apiBaseUrl="" /> */}
      <ManagingCommitteeListView />
    </div>
  );
};

export default ManagingCommitteePage;