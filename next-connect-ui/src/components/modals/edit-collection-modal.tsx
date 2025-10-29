"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Folder,
  Code,
  Save,
  Database
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useTranslation } from "@/hooks/use-translation"
import { Collection } from "@/types/collection"

const editFormSchema = (t: (key: string) => string) => z.object({
  name: z.string(),
  description: z.string(),
})

interface EditCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  collection: Collection | null
}

export function EditCollectionModal({ open, onOpenChange, onSuccess, collection }: EditCollectionModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = editFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (collection) {
      form.reset({
        name: collection.name,
        description: collection.metadata?.description || "",
      })
    }
  }, [collection, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!collection) return

    setIsLoading(true)

    try {
      const updatedMetadata = {
        ...collection.metadata,
        description: values.description,
      }

      const response = await fetch(`/api/collections/${collection.uuid}`, {
        method: 'PATCH',
        body: JSON.stringify({
          metadata: updatedMetadata
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || t('collections.modal.updateError'))
      }

      toast.success(t('common.success'), {
        description: t('collections.modal.updateSuccess'),
      })
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error("Failed to update collection:", error)
      toast.error(t('common.error'), {
        description: error.message || t('collections.modal.updateError'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden p-0">
        <DialogHeader className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">          
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <Folder className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {t('collections.modal.editTitle')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-300">
                {t('collections.modal.editDescription')}
              </DialogDescription>
            </div>
            <div className="ml-auto">
              <Database className="h-5 w-5 text-indigo-500 animate-pulse" />
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-blue-500" />
                      {t('collections.modal.nameLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        readOnly 
                        className="transition-all duration-200 bg-gray-100 dark:bg-gray-800" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-emerald-500" />
                      {t('collections.modal.descriptionLabel')}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('collections.modal.descriptionPlaceholder')} 
                        className="resize-none min-h-[100px] font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    size="sm"
                    className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('collections.modal.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('common.save')}
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
