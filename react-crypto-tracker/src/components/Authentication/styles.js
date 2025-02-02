import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#424242',
    color: 'white',
    borderRadius: 10,
    padding: 20,
    width: 400,
    maxWidth: '90%',
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    gap: 20,
    fontSize: 20,
  },
});
