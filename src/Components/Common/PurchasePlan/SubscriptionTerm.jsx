import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const SubscriptionTerm = ({ isRead, setIsRead }) => {
    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full "
        >
            <div className="modal-overlay">
                <div className="modal p-0 lg:w-[1000px] md:w-[900px] sm:w-full max-h-full overflow-y-auto">
                    <div className="relative w-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    By subscribing to our service, you agree to the following terms regarding billing:
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => setIsRead(!isRead)}
                                />
                            </div>
                            <div className="flex flex-wrap p-6">
                                <div className='flex flex-col items-center gap-2'>
                                    <label>
                                        <p className='font-bold'>1. Monthly Subscription:</p> <span> Your subscription to our service is on a monthly basis. You will be charged in advance every month for the number of screens you have added as per the purchased plan.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>2. Advance Payment:</p>  <span>Subscription charges are billed in advance of the service period. Your billing cycle begins on the date you subscribe and recurs every month on the same date.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>3. Screen Additions:</p>  <span>If you add additional screens beyond your initial subscription plan during the billing cycle, you will be charged for these additional screens on a pro-rata basis for the remaining billing period.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>4. Cancellation and Refunds:</p> <span> You can cancel your subscription at any time. However, refunds are not provided for partial subscription periods. Upon cancellation, your subscription will remain active until the end of the current billing cycle.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>5. Payment Methods:</p> <span> We accept various payment methods, including credit/debit cards and
                                            electronic fund transfers. By providing payment information, you authorize us to charge the
                                            specified amount to your chosen payment method.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>6. Updating Payment Information:</p>  <span>It is your responsibility to ensure that your payment information is accurate and up-to-date. Failure to update payment information may result in suspension or termination of your subscription.</span>
                                    </label>
                                    <label>
                                        <p className='font-bold'>7. Changes to Subscription Plans:</p>  <span>We reserve the right to modify subscription plans, including
                                            pricing and features, with prior notice. Changes will not affect the current billing cycle but will apply to subsequent billing periods.</span>
                                    </label>

                                    <div className='flex flex-col items-center justify-center font-bold gap-2'>
                                        <span>
                                            By continuing to use our service, you acknowledge and agree to these billing terms.
                                        </span>
                                        <span>If you have any questions or concerns regarding billing, please contact our customer support team for assistance.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionTerm
