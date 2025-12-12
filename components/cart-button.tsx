"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"

interface CartButtonProps {
  productId: string
  productName: string
  className?: string
}

export default function CartButton({ productId, productName, className }: CartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsAdding(false)
    setIsAdded(true)

    // Show success message
    toast.success(`Đã thêm "${productName}" vào giỏ hàng!`)

    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button size="lg" className={className} onClick={handleAddToCart} disabled={isAdding || isAdded}>
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
          Đang thêm...
        </>
      ) : isAdded ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Đã thêm
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Thêm vào giỏ hàng
        </>
      )}
    </Button>
  )
}
