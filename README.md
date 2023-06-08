<a name="readme-top"></a>

# Music Entities Application



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#relevant-stack-choses">Relevant stack choses</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project



This project is a web application built for a computer science course at Babes Bolyai University

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* React
* Django
* Postgres
* Nginx
* Cerbot
* Redis

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This guide will walk you through the steps to set up a **development** or **production** environment.

### Prerequisites

This project requires npm, Docker, and Docker Compose.


* Docker: Visit [Docker's website](https://www.docker.com/) and follow the instructions to install Docker and docker-compose for your operating system.
* npm: Install npm using nvm from [nvm's GitHub](https://github.com/nvm-sh/nvm) page. Make sure to install npm version **7.7.6** or higher.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/UBB-SDI-23/lab-5x-dpie2303
    ```
2. Copy the **.env.template** files from the **server** and **ui_music** directories and rename them to .env.  
   Configure the environment variables for the **server**, **database**, and **hosting services**
   ```sh
   POSTGRES_USER= # Username for Postgres
   POSTGRES_PASSWORD= # Password for Postgres
   POSTGRES_DB= # Database name
   DOMAIN= # Domain for Let's Encrypt Production only
   EMAIL= # Email for Let's Encrypt Production only
   DEBUG= # True or False
   ```  
   Setup base URL's for the **frontend** application.  
   ```sh
   REACT_APP_API_BASE_URL=http://localhost:8000 # example for development env
   REACT_APP_SOCKET_BASE_URL=ws://localhost:8000 # example for development env
   ``` 
    
3. To set up a development environment, start the **server** and **database** in the server directory:
   ```sh
   docker-compose -f docker-compose-dev.yml build
   docker-compose -f docker-compose-dev.yml up -d
   ```
   Then, in the **ui_music** directory, execute:
   ```sh
   npm install
   npm start
   ```
4. Setting up a **production**  environment

   In the  **server** directory execute the fallowing commands to 
   prepare the SSL certificates for the initial run:
   ```sh
   docker-compose -f docker-compose-initiate.yml build
   docker-compose -f docker-compose-initiate.yml up -d
   docker-compose down
   ```
   After the certificates for the HTTPS connection are created, start the Docker Compose setup:
   ```sh
   docker-compose -f build
   docker-compose -f up -d
   ```

   For the deployment and hosting of the **frontend** application, use [Netlify](https://www.netlify.com/).
   Refer to their documentation for setup instructions.  
   **Do not forget to setup the enviroment variabiles!**

5. Finalize the setup: 
    ```sh
   docker ps # get the server container id
   docker exec -it <container id> bash
   python manage.py migrate # migrate the models to the db
   ```
   To stop your application, in the  **server** directory execute:
   ```sh
   docker-compose down 
   ```


5. **Optional!**  
   This aplication contains a setup to populate the database.
   **Make sure** that your do this setup **before** you do any actions on the apllication.  
   Adjust the number of entities created by modifying the script in  **server/music_library**  

   Start your **backend** setup using the previous steps.
   Create the **.sql** files that contain the artificial data.  
   ```sh
   docker ps # get the server container id
   docker exec -it <container id> bash
   python music_library/generate_sql.py 
   ```
   This may take a while depending on the number of entities and your computer's performance.   
   To execute the **.sql** files and populate the **db**, execute the following:
   ```sh
   docker ps # get the db container id
   docker exec -it <container id> bash
   chmod +x sql_scripts/populate_db.sh
   ./sql_scripts/populate_db.sh
   ```
   Your database should be populated now!


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Relevant stack choses. 



### Django

  1. django-debug-toolba: Great for debugging, but can add overhead and expose sensitive data if not disabled in production. Available only wehn DEBUG is set to True.  
  2. djangorestframework_simplejwt: Provides JWT authentication. but it has limited customization options.
  3. scikit-learn: Implements NearestNeighbors for playlist recommendations, but while it provides accurate recommendations, the prediction part can be slow, especially for large datasets.
  4. daphne: Starts the server using ASGI but is less widely used and documented than other servers.
  
### React
  1. axios: Easy-to-use rest API client, but larger and slower than the native fetch API.
  2. mui/material: Popular React UI framework, but can be heavy for simple projects and its design might not suit all.
      
### Nginx & Certbot
  These tools are used to create a proxy server and ensure HTTPS connection. 
### Redis
  Redis is used as a communication layer for the Django application, enabling multiple Django threads to communicate with each other using a web socket connection. While Redis is fast and efficient, it requires careful management of data persistence and memory use.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
