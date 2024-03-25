'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from 'react-use';
import { useMutation } from '@tanstack/react-query';

import { generateIconUrl } from '@/utils';
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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import IframeComponent from '@/components/IframeComponent';
import Loading from '@/components/loading';

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
  url: z.string().url({
    message: 'Invalid URL'
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
    const [loading, setLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        url: '',
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

    const [, cancel] = useDebounce(
      () => {
        console.log('watchedUrl', watchedUrl);

        // 定义URL验证模式
        const urlSchema = z.string().url();

        // 使用safeParse代替check
        const parseResult = urlSchema.safeParse(watchedUrl);

        if (parseResult.success) {
          // 如果URL验证成功
          mutateAsync(watchedUrl)?.then((data) => {
            if (data) {
              form.setValue('name', data.title || '');
              form.setValue('description', data.description || '');
              if (data.icon) {
                form.setValue(
                  'icon',
                  z.string().url().safeParse(data.icon).success
                    ? data.icon
                    : generateIconUrl(watchedUrl, data.icon)
                );
              }
            }
          });
        } else {
          setLoading(false);
          form.resetField('name');
          form.resetField('description');
          form.resetField('icon');
        }
      },
      1000,
      [watchedUrl, form]
    );

    const handleFormSubmit = useCallback(
      (data: z.infer<typeof formSchema>) => {
        onFinish?.(data);
      },
      [onFinish]
    );

    useImperativeHandle(ref, () => form);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={confirmLoading}
                  disabled={isPending}
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
