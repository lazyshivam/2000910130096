const express = require('express');
const axios = require('axios');
const cors=require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// {
//     "clientID": "f04fa6a1-3f44-4ad0-a652-78eb8e3f0570",
//     "clientSecret": "fYbgDOqiPLemjnbt"
//   }
// John Doe Railway Server API URLs
const registerURL = 'http://20.244.56.144/train/register';
const authURL = 'http://20.244.56.144/train/auth';
const trainsURL = 'http://20.244.56.144/train/trains';

// Route to register the company with the John Doe Railway Server
app.post('/register', async (req, res) => {
  try {
    const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

    // Make the registration request to John Doe Railway Server
    const response = await axios.post(registerURL, {
      companyName,
      ownerName,
      rollNo,
      ownerEmail,
      accessCode,
    });

    // Store the clientID and clientSecret from the response
    const { clientID, clientSecret } = response.data;
    res.json({ clientID, clientSecret });
  } catch (error) {
    console.error('Error during company registration:', error.message);
    res.status(500).json({ error: 'Company registration failed' });
  }
});

// Route to obtain the authorization token
app.post('/auth', async (req, res) => {
    try {
      const { clientID, ownerName, companyName, rollNo, ownerEmail, clientSecret } = req.body;
  
      // Make the authorization request to John Doe Railway Server
      const response = await axios.post(authURL, {
        clientID,
        ownerName,
        companyName,
        rollNo,
        ownerEmail,
        clientSecret,
      });
  
      // Store the access token from the response
      res.json(response.data);
    } catch (error) {
      console.error('Error during authorization:', error.message);
      res.status(500).json({ error: 'Authorization failed' });
    }
  });

  // Route to fetch train details
app.get('/trains', async (req, res) => {
    const access_token=req.header('access_token');
    try {
    
      if (!access_token) {
        return res.status(401).json({ error: 'Unauthorized. Please obtain an access token first.' });
      }
  
      // Make the request to John Doe Railway Server with the access token in the headers
      const response = await axios.get(trainsURL, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error while fetching train details:', error.message);
      res.status(500).json({ error: 'Failed to fetch train details' });
    }
  });
// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
