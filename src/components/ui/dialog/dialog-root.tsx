import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DialogOverlay } from "./dialog-overlay"
import { DialogContent } from "./dialog-content"
import { DialogHeader } from "./dialog-header"
import { DialogFooter } from "./dialog-footer"
import { DialogTitle } from "./dialog-title"
import { DialogDescription } from "./dialog-description"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}