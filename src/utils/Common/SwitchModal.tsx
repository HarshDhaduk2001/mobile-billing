import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ColorToolTip } from "./CommonStyle";

interface SwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  firstContent: string;
  onActionClick: () => void;
}

const SwitchModal = ({
  isOpen,
  onClose,
  title,
  firstContent,
  onActionClick,
}: SwitchModalProps) => {
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="flex flex-row justify-between items-center">
            <span>{title}</span>
            <ColorToolTip title="Close" placement="top" arrow>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </ColorToolTip>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="border-y border-y-lightSilver w-full py-4"
          >
            <Typography className="pb-2 text-darkCharcoal flex items-start">
              {firstContent ? firstContent : ""}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="mb-2">
          <Button
            variant="outlined"
            className="rounded-[4px] !h-[36px] !text-defaultRed"
            onClick={() => {
              onClose();
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="rounded-[4px] !h-[36px] !mx-6 !bg-primary cursor-pointer"
            onClick={() => {
              onActionClick();
              onClose();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SwitchModal;
