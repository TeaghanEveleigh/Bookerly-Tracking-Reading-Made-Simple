import { ZodNanoID } from 'zod';
import { Snackbar, Alert } from "@mui/material";
import React from 'react';


export type NotificationProps = {
  notification: {
    id: ZodNanoID;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
  };
  onDismiss: (id: ZodNanoID) => void;
};

export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
}: NotificationProps) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
    onDismiss(id);
    setOpen(false);
  };

  return (
    <Snackbar
    open={true}
      autoHideDuration={6000}
      anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      key={String(id)}>
      <Alert 
      severity={type}
      onClose={handleClose}>
        
        <div style={{display : 'flex' , flexDirection : 'column'}}>
          <div style={{fontWeight : 'bold'}}>{title}</div>
          <div>{message}</div>
        </div>
        </Alert>
    </Snackbar>
  );
};