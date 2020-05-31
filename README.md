


<h1 align="center">Welcome to Let's Meet API :v: </h1>

<div align="center">
    <img  src="./images/lets-meet.png"  alt="Let's meet logo"  width=500">
</div>



<div align="center">

<img  src="https://forthebadge.com/images/badges/built-with-love.svg" />

</div>



<div align="center">

<a  href="https://github.com/kammradt/lets-meet-api/stargazers">

<img  src="https://img.shields.io/github/stars/kammradt/lets-meet-api.svg?style=for-the-badge" />

</a>

</div>



##  Goals 🗺️

Some time ago, I was interested on Typescript and building APIs with it, so I started a [NestJs course](https://github.com/kammradt/learning-nestjs). This project aims to apply what I learned, by creating a an API to a *[Meetup](https://www.meetup.com/) clone* that I'm calling **Let's meet!**



##  Description 📝

**Let's meet!** is a study project aiming to be a simpler version of [Meetup](https://www.meetup.com/).

It will allow users to create, manage and organize events.
You can verify more below!


###  Development progress :bar_chart:

> I'm trying to follow gitflow, so you can see my progress usings the tags from this repository too! :blush:


- [x] **Users module**
	- [x] Anyone should be able to register and become a User
	- [x] Any User should be able to get own information
	- [x] Admins should be able to retrieve information about all users
	    - [ ] Create a custom PaginationOptions for listing users by role
	- [x] Admins should be able to update a User role

- [x] **Auth module**
	- [x] Any User should be able to perform login and receiving a JWT to use in next requests.
	- [x] This module should export authorization and authentication functionality for all other modules

- [x] **Events module**
	- [x] Regular Users should be able to create events with 50 max attendees
		- [x] 100 attendees for Premium Users
	- [x] Users should be able to retrieve their events
	- [ ] Users should be able to retrieve events that they are attending
	- [x] Users should be able to edit the Event title, description, date, etc
	- [x] Users should be able to cancel their Events
		- [x] Admins should be able to cancel any Event
	- [x] Events should be able to hold Users requesting to attend
	- [x] Events should be able to hold Users requesting to exit from it
	- [ ] Admins and the Event owner can remove a User from a specific event
	- [ ] Users should be able to create comments, edit and delete comments on Events
		- [ ] Event owner and Admin and remove comments from any users
	- [ ] A scheduled job should be created to update events and mark them as DONE after current date is bigger than event endDate field


- [ ] **Notifications module**
    - [ ] Thinking about it 🤔

##  Try it out :exclamation:

I mapped all API calls using [Insomnia](https://insomnia.rest/download/core/?&ref=), so it is easier for testing flows while the front-end app is not completely ready.     
To be easier for you, just import [this file](https://github.com/kammradt/lets-meet-api/blob/master/insomnia/Insomnia_api.json)
 

##  How to use :globe_with_meridians:

API: https://api-lets-meet.herokuapp.com/  
Web app: https://lets-meet.now.sh/  
[Web app repo](https://github.com/kammradt/lets-meet-client)

##  How to use :house:

### Database setup

We are using PostgreSQL 12.

- With docker:
	`docker-compose up`

- Local database:  (look at `/config/default.json`)
  ```js
	{
	  "host": "localhost",
      "database": "letsmeet",
      "username": "postgres",
      "password": "postgres",
      "port": 5432
	}
	```
***

### API setup

We are using NestJS.
> NestJS has a really usefull cli, I recommend you installing it!
```bash
$ npm install -g @nestjs/cli
```

Recommended TSC version: `Version 3.9.3`
Recommended Node version: `v12.16.3`
(It is easier to install using [nvm!](https://github.com/nvm-sh/nvm))

- Installing Node and Typescript:
	```bash
	$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	$ nvm install v12.16.3
	$ npm install -g typescript
	```

- Running the API:
	```bash
	$ npm run start:dev
	```

- Running tests:
	```bash
	$ npm run test
	```

##  Help is always welcome :wink:
> Because as you can see, I have absolute no ideia what I'm doing :satisfied:

### How can I help?
- You can [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this project and modify what you want. And then, send modifications using the [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) system.

### What is and How to create a Fork?
- A Fork is basically a copy of this repository, but in your account. So, you have access to all files and can do whatever you want with your version.
Using github is really easy to create a Fork, just follow:
> You just need to click on `Fork` button on the top right!
![Fork instructins](https://i.imgur.com/zM6QQU2.gif)

### What is and How to create a Pull Request?
- A Pull Request is a way of putting code from multiple people together in a organized way. After your modifications on your own forked repository, you can commit those changes and push to it.
Now you have you repository updated with changes, but note that all those changes are only on your forked version.
How to put your version together with mine and have a better project? Really easy! Just follow:
> 1. Go to the Pull Request tab
> 2. Click on `new pull Request`
> 3. You can verify the modifications
> 4. Click on `Create pull Request`
> 5. It is a good ideia to write a description of what was added
> 5. Create it! Thanks so much!
![PR instructins](https://i.ibb.co/3rJ50TF/pr.gif)


##  Author

👤 **Vinicius Kammradt**

* Website: https://kammradt.now.sh/

* Twitter: [@kammzinho](https://twitter.com/kammzinho)

* Github: [@kammradt](https://github.com/kammradt)

* LinkedIn: [@vinicius-kammradt](https://linkedin.com/in/vinicius-kammradt)
