import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

const ContactUs: React.FC = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        textAlign="center"
        sx={{ mb: 3 }}
        id="contact-us"
      >
        Contact Us
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" display="flex" flexDirection="column">
            <TextField
              name="emailSender"
              required
              label="Email Address"
              margin="normal"
              variant="standard"
            />
            <TextField
              name="emailName"
              required
              label="Your Name"
              margin="normal"
              variant="standard"
            />
            <TextField
              name="emailMessage"
              required
              label="Message"
              multiline
              rows={4}
              margin="normal"
              variant="standard"
            />
            <Button type="submit" variant="contained" sx={{ mx: "auto" }}>
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactUs;
