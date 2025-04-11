import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  url: string;
  type: "doc" | "link";
}

const AccessLearningLinksModal = ({
  isOpen,
  onClose,
  materials = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  materials: Resource[];
}) => {
  if (!isOpen) return null;

  // Group resources by type for better organization
  const documentResources = materials.filter(
    (resource) => resource.type === "doc"
  );
  const linkResources = materials.filter(
    (resource) => resource.type === "link"
  );

  return (
    <div className='fixed inset-0 bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-xl'>
        {/* Header with gradient background */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center p-5'>
          <h2 className='text-xl font-semibold text-white'>
            Learning Resources
          </h2>
          <Button
            onClick={onClose}
            className='text-black bg-white hover:text-white rounded-full p-2 transition-colors'
            aria-label='Close modal'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </Button>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(85vh-132px)]'>
          <p className='text-gray-600 mb-6 border-l-4 border-blue-500 pl-3 italic'>
            Access all learning materials shared for this content. Click on any
            resource to open it.
          </p>

          {materials.length === 0 ? (
            <div className='text-center py-12'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
              <p className='mt-2 text-gray-500 text-lg'>
                No resources available
              </p>
              <p className='text-sm text-gray-400 mt-1'>
                Check back later for updates
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Documents Section */}
              {documentResources.length > 0 && (
                <div>
                  <h3 className='text-lg font-medium mb-3 flex items-center text-gray-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-2 text-red-500'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Documents ({documentResources.length})
                  </h3>
                  <div className='grid gap-3 md:grid-cols-2'>
                    {documentResources.map((resource) => (
                      <Link
                        key={resource.id}
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-start space-x-3'>
                        <div className='text-red-500 flex-shrink-0 mt-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                          </svg>
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium text-gray-900 group-hover:text-blue-700 transition-colors'>
                            {resource.name}
                          </div>
                          <div className='text-sm text-gray-500 mt-1'>
                            PDF Document
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Links Section */}
              {linkResources.length > 0 && (
                <div>
                  <h3 className='text-lg font-medium mb-3 flex items-center text-gray-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-2 text-blue-500'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Web Links ({linkResources.length})
                  </h3>
                  <div className='grid gap-3 md:grid-cols-1'>
                    {linkResources.map((resource) => (
                      <Link
                        key={resource.id}
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-start space-x-3'>
                        <div className='text-blue-500 flex-shrink-0 mt-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                            />
                          </svg>
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium text-gray-900 group-hover:text-blue-700 transition-colors'>
                            {resource.name}
                          </div>
                          <div className='text-sm text-gray-500 mt-1 truncate max-w-sm'>
                            {resource.url}
                          </div>
                        </div>
                        <div className='text-gray-400 group-hover:text-blue-500 transition-colors'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            viewBox='0 0 20 20'
                            fill='currentColor'>
                            <path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
                            <path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex justify-end p-4 border-t bg-gray-50'>
          <Button
            onClick={onClose}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm'>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessLearningLinksModal;
