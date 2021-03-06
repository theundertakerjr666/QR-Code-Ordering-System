// rendering the dialog for the detail information of each dish
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
// import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { restaurants } from '../Firebase/firebase'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import firebase from "firebase";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }

});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }

}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

// var dic = new Map();
export default function DishDetailDialog(props) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = React.useState(false);
  const [addAlert, setAddAlert] = useState(false);

  function handleAddButton(dishRef, tableID) {
    const increment = firebase.firestore.FieldValue.increment(1);
    console.log(dishRef.name);
    var gt = dishRef.name;
    const st = restaurants.doc(props.restaurant).collection("tables").doc(tableID).collection("cart").doc(gt);
    restaurants.doc(props.restaurant).collection("tables").doc(tableID).collection("cart").doc(gt)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          // console.log("Document data:", doc.data());
          st.update({ number: increment });
        } else {
          // doc.data() will be undefined in this case
          const fa = dishRef.name;
          restaurants.doc(props.restaurant).collection('tables').doc(tableID).collection('cart').doc(fa)
            .set({
              dishRef,
              number: 1,
            })

        }
        console.log("aaa");
        setAddAlert(true);
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

  }

  useEffect(() => {
    // console.log('get dish', props.dish);
    if (props.open != null) {
      setOpen(true);
    }
  }, [props.open])
  const handleClose = () => {
    setOpen(false);
  };
  if (props.dish != null) {
    return (
      <div>



        <Dialog
          fullScreen={fullScreen}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {props.dish.name}
          </DialogTitle>
          <DialogContent dividers>
            <img
              style={{ width: '350px' }}
              src={
                props.dish.image != null ? props.dish.image : "https://firebasestorage.googleapis.com/v0/b/qr-code-ordering-system.appspot.com/o/koisushiMenu%2Fdefault-food-image.jpg?alt=media&token=e6958bef-eae1-4144-b670-e717768d518f"
              }
              alt={props.dish.name}
            />
            <Typography gutterBottom>
              {props.dish.description}
            </Typography>

          </DialogContent>
          <DialogActions>
            <Box m={2} fontFamily="Monospace" fontStyle="italic" textAlign="left">
              <Typography gutterBottom >${props.dish.price}</Typography></Box>
            <IconButton
              onClick={() => handleAddButton(props.dish, props.table)}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </DialogActions>
        </Dialog>


        <Dialog
          open={addAlert}
          onClose={() => { setAddAlert(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Succesfully add to cart!
                                 </DialogContentText>
          </DialogContent>

        </Dialog>

      </div>
    );
  } else {
    return (
      <div>
      </div>
    )
  }


}
