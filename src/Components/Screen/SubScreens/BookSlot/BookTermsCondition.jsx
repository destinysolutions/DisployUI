import React from 'react'

const BookTermsCondition = ({ handleAcceptTerms, modalRef, setShowModal, setallSlateDetails ,allSlateDetails}) => {
    return (
        <div className="backdrop bg-white">
            <div ref={modalRef} className="user-model-TC book-modal">
                <div className="relative  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="flex items-center justify-between md:p-5 border-b rounded-t dark:border-gray-600 p-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white w-full max-w-2xl max-h-full">
                            Terms And Agreement
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="default-modal"
                            onClick={() => {
                                setShowModal(false);
                            }}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4 overflow-y-auto max-h-[calc(100vh - 200px)]">
                        <ol className="space-y-4 text-gray-500 list-decimal list-inside dark:text-gray-400">
                            <li>
                                <b>Prohibited Activities</b>
                                <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                    <li>
                                        You may not access or use the Site for any purpose other
                                        than that for which we make the Site available. The Site
                                        may not be used in connection with any commercial
                                        endeavors except those that are specifically endorsed or
                                        approved by us.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <b>Contribution License</b>
                                <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                    <li>
                                        You and the Site agree that we may access, store,
                                        process, and use any information and personal data that
                                        you provide following the terms of the Privacy Policy
                                        and your choices (including settings). By submitting
                                        suggestions or other feedback regarding the Site, you
                                        agree that we can use and share such feedback for any
                                        purpose without compensation to you.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <b>Term And Termination</b>
                                <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                    <li>
                                        These terms of use shall remain in full force and effect
                                        while you use the site. Without limiting any other
                                        provision of these terms of use, we reserve the right
                                        to, in our sole discretion and without notice or
                                        liability, deny access to and use of the site and the
                                        marketplace offerings (including blocking certain ip
                                        addresses), to any person for any reason or for no
                                        reason, including without limitation for breach of any
                                        representation, warranty, or covenant contained in these
                                        terms of use or of any applicable law or regulation. We
                                        may terminate your use or participation in the site and
                                        the marketplace offerings or delete any content or
                                        information that you posted at any time, without
                                        warning, in our sole discretion.
                                    </li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div className="flex items-center p-4 gap-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            data-modal-hide="default-modal"
                            type="button"
                            className="w-32 text-white bg-SlateBlue font-medium rounded-full px-6 py-3 text-center hover:bg-primary border border-SlateBlue"
                            onClick={() => handleAcceptTerms()}
                        >
                            I accept
                        </button>
                        <button
                            data-modal-hide="default-modal"
                            type="button"
                            className="bg-primary w-32 text-white text-base px-6 py-3 border border-primary shadow-md rounded-full "
                            onClick={() => {
                                setShowModal(false);
                                setallSlateDetails({ ...allSlateDetails, terms: false })
                            }}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookTermsCondition
