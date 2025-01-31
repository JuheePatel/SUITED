import React from 'react';

export function Tabs({ value, onValueChange, children, className, ...props }) {
  return (
    <div className={`w-full ${className}`} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedValue: value, onValueChange });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ className, children, selectedValue, onValueChange, ...props }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            selectedValue,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, children, className, onValueChange, selectedValue, ...props }) {
  const isSelected = selectedValue === value;
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? 'bg-accent text-primary'
          : 'text-foreground hover:bg-accent/10'
      } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, selectedValue, ...props }) {
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 