import { Box, Card, CardContent, Typography } from "@mui/material";

const HomeHowItWorks: React.FC = () => {
  return (
    <Box my={4}>
      <Typography variant="h3" textAlign="center" sx={{ mb: 3 }}>
        HOW IT WORKS?
      </Typography>
      <Card sx={{ mb: 3, p: 4 }}>
        <CardContent sx={{ px: 8 }}>
          <Typography variant="h5" textAlign="center" sx={{ mb: 3 }}>
            Token portability backed by cryptographic proofs. <br />
            Move tokens back and forth between the Syscoin and NEVM blockchains.
          </Typography>
          <Typography
            variant="body1"
            fontStyle="italic"
            textAlign="center"
            sx={{ w: "50%", mb: 3 }}
          >
            An industry-first, zero counterparty bridge for moving tokens back
            and forth between the Syscoin and NEVM blockchains
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold">
              Burn tokens on the Syscoin or NEVM blockchain
            </Typography>
            <Typography variant="body1">
              Burning tokens provably removes them from the circulating supply
              on one chain. The proofs that result from this will be used to
              mint tokens on the adjacent chain.
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Mint tokens on the NEVM or Syscoin blockchain
            </Typography>
            <Typography variant="body1">
              Using the proof of burn from one chain, new tokens can be minted
              into the adjacent chain. This results in a 1:1 representation of
              the tokens on the new chain and empowers them with all the
              capabilities of that chain.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomeHowItWorks;
