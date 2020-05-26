


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
	- [x] Users should be able to edit the Event title, description, date, etc.
	- [x] Users should be able to cancel their Events
		- [x] Admins should be able to cancel any Event
	- [x] Events should be able to hold Users requesting to attend
	- [x] Events should be able to hold Users requesting to exit from it
	- [ ] Admins and the Event owner can remove a User from a specific event
	- [ ] Users should be able to create comments, edit and delete comments on Events
		- [ ] Event owner and Admin and remove comments from any users


- [ ] **Notifications module**
    - [ ] Thinking about it 🤔


##  How to use :globe_with_meridians:

API: https://api-lets-meet.herokuapp.com/
Web app: https://lets-meet.now.sh/
[Web app repo](https://github.com/kammradt/lets-meet-client)

##  How to use :house:

Database:
`docker-compose up`

API Dev:
`npm run start:dev`

API Build:
`npm run build`

API tests:
`npm run test`

Web app:
`npm run serve`

Changed!


##  Author

👤 **Vinicius Kammradt**

* Website: https://kammradt.now.sh/

* Twitter: [@kammzinho](https://twitter.com/kammzinho)

* Github: [@kammradt](https://github.com/kammradt)

* LinkedIn: [@vinicius-kammradt](https://linkedin.com/in/vinicius-kammradt)
