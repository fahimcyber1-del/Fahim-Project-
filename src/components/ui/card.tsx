import React from "react";
import { cn } from "../../lib/utils";
import { useAppearance } from "../setting/AppearanceContext";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { settings } = useAppearance();
    
    let cardStyleClass = "bg-white border border-slate-200 shadow-sm";
    
    if (settings && settings.cardStyle) {
      if (settings.cardStyle === 'flat') {
        cardStyleClass = "bg-white border-0 shadow-none ring-1 ring-slate-100";
      } else if (settings.cardStyle === 'outline') {
        cardStyleClass = "bg-transparent border-2 border-slate-200 shadow-none";
      }
    }

    return (
      <div 
        ref={ref} 
        className={cn(`rounded-xl overflow-hidden`, cardStyleClass, className)} 
        {...props} 
      />
    );
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 border-b border-slate-100", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xs font-black uppercase tracking-widest text-slate-950", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[10px] uppercase font-bold text-slate-500", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-4 border-t border-slate-100 bg-slate-50", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
