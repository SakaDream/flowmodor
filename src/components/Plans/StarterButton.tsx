'use client';

import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import getAccessToken from '@/utils/paypal';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

async function cancelSubscription(id: string, router: AppRouterInstance) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/billing/subscriptions/${id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      console.error(response);
      throw new Error('Something went wrong');
    }
    toast('Subscription cancelled successfully');
    router.refresh();
  } catch (error: any) {
    toast(error.message);
  }
}

export default function StarterButton({
  status,
  id,
}: {
  status: string;
  id: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        isDisabled={status !== 'ACTIVE'}
        color="primary"
        radius="sm"
        className="font-semibold text-[#23223C]"
        onPress={onOpen}
      >
        {status === 'ACTIVE' ? 'Downgrade to Starter' : 'Current plan'}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: 'bg-[#23223C]',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Subscription Cancellation
              </ModalHeader>
              <ModalBody>
                Are you sure you wish to cancel your subscription? You will
                retain access to Pro features until the end of your current
                billing period. Note that your subscription will not be renewed,
                and you will not be charged starting from the next month.
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isLoading}
                  color="secondary"
                  onPress={onClose}
                >
                  Go Back
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={async () => {
                    setIsLoading(true);
                    await cancelSubscription(id, router);
                    setIsLoading(false);
                    onClose();
                  }}
                >
                  Yes, Cancel Subscription
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
