'use client';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from 'react-use';
import { useMutation } from '@tanstack/react-query';

import { generateIconUrl } from '@/utils';
import { searchItemByUrl } from '@/database/dapps-repository';
import { getWebMetadata } from '@/server/getWebMetadata';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import IframeComponent from '@/components/IframeComponent';
import Loading from '@/components/loading';

type HttpsUrl = `https://${string}`;

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string'
    })
    .min(3, {
      message: 'Name must be at least 3 characters'
    })
    .max(255, {
      message: 'Name must be at most 255 characters'
    }),
  url: z
    .string()
    .url({ message: 'Invalid URL' })
    .refine((url): url is HttpsUrl => url.startsWith('https://'), {
      message: 'URL must start with https://'
    }),
  icon: z.string().optional(),
  description: z.string().optional()
});

export type FormReturn = UseFormReturn<z.infer<typeof formSchema>>;

interface AddDappProps {
  open: boolean;
  confirmLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (data: z.infer<typeof formSchema>) => void;
}

const AddDapp = forwardRef(
  ({ open, confirmLoading, onOpenChange, onFinish }: AddDappProps, ref) => {
    const [appIsExist, setAppIsExist] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        url: 'https://',
        icon: '',
        description: ''
      }
    });
    const { watch, register } = form;

    const watchedUrl = watch('url');
    const watchedIcon = watch('icon');
    const watchedDescription = watch('description');

    // getWebMetadata
    const { isPending, mutateAsync } = useMutation({
      mutationFn: getWebMetadata
    });

    const setFormValues = useCallback(
      (data: any, url: string) => {
        form.setValue('name', data.title || '');
        form.setValue('description', data.description || '');
        if (data.icon) {
          form.setValue(
            'icon',
            z.string().url().safeParse(data.icon).success
              ? data.icon
              : generateIconUrl(url, data.icon)
          );
        }
      },
      [form]
    );

    useDebounce(
      async () => {
        const parseResult = formSchema.shape.url.safeParse(watchedUrl);

        if (parseResult.success) {
          const searchData = await searchItemByUrl(watchedUrl);

          if (searchData?.length) {
            setAppIsExist(true);
            setFormValues(
              {
                ...searchData[0],
                title: searchData[0].name
              },
              watchedUrl
            );
            return;
          }
          setAppIsExist(false);
          mutateAsync(watchedUrl)?.then((data) => {
            if (data) {
              setFormValues(data, watchedUrl);
            }
          });
        } else {
          form.resetField('name');
          form.resetField('description');
          form.resetField('icon');
        }
      },
      500,
      [watchedUrl, form]
    );

    const handleOpenChange = useCallback(
      (open: boolean) => {
        onOpenChange(open);
        if (!open) {
          form.reset();
        }
      },
      [form, onOpenChange]
    );

    const handleFormSubmit = useCallback(
      (data: z.infer<typeof formSchema>) => {
        onFinish?.(data);
      },
      [onFinish]
    );

    useImperativeHandle(ref, () => form);

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Dapp</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Url</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name your Dapp (e.g., Uniswap)"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <input type="hidden" {...register('icon')} />
                <input type="hidden" {...register('description')} />

                {isPending ? (
                  <div className="flex justify-center">
                    <Loading />
                  </div>
                ) : watchedIcon || watchedDescription ? (
                  <div className="flex flex-col gap-4 rounded bg-card p-4">
                    {!!watchedIcon && <IframeComponent imageSrc={watchedIcon} />}
                    {!!watchedDescription && (
                      <span className="text-sm text-muted-foreground">{watchedDescription}</span>
                    )}

                    {appIsExist ? (
                      <p className="text-sm text-red-500"> This app already exists in your list.</p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={confirmLoading}
                  disabled={isPending || appIsExist}
                >
                  Add
                </Button>
              </form>
            </Form>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

AddDapp.displayName = 'AddDapp';
export default AddDapp;
function setIcon(icon: string) {
  throw new Error('Function not implemented.');
}
