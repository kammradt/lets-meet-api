


<h1 align="center">Welcome to Termigol 💻</h1>

<div align="center">
    <img  src="./images/lets-meet.png"  alt="Let's meet logo"  width=500">
</div>



<div align="center">

<img  src="https://forthebadge.com/images/badges/built-with-love.svg" />

</div>



<div align="center">

<a  href="https://github.com/kammradt/lets-meet/stargazers">

<img  src="https://img.shields.io/github/stars/kammradt/lets-meet.svg?style=for-the-badge" />

</a>

</div>



##  Goals 🗺️

Some time ago, I was interested on Typescript and building APIs with it, so I started a [NestJs course](https://github.com/kammradt/learning-nestjs). This project aims to apply what I learned, by creating a an API to a *[Meetup](https://www.meetup.com/) clone* that I'm calling **Let's meet!**



##  Description 📝

**Let's meet!** is a study project aiming to be a simpler version of [Meetup](https://www.meetup.com/).

It will allow users to create, manage and organize events.
You can verify more below!


###  Development progress :bar_chart:


- [ ] **Users module**
	- [x] Anyone should be able to register and become a User
	- [x] Any User should be able to get own information
	- [ ] Admins should be able to retrieve information about all users
	- [ ] Admins should be able to update a User role
	- [ ] Admins should be able to soft delete users

- [x] **Auth module**
	- [x] Any User should be able to perform login and receiving a JWT to use in next requests.
	- [x] This module should export authorization and authentication functionality for all other modules

- [ ] **Events module**
	- [ ] Regular Users should be able to create events with 50 max attendees
		- [ ] 100 attendees for Premium Users
	- [ ] Users should be able to edit the Event title, description, date, etc.
	- [ ] Users should be able to cancel their Events
		- [ ] Admins should be able to cancel any Event
	- [ ] Events should be able to hold Users requesting to attend
	- [ ] Events should be able to hold Users requesting to exit from it
	- [ ] Admins and the Event owner can remove a User from a specific event
	- [ ] Users should be able to create comments, edit and delete comments on Events
		- [ ] Event owner and Admin and remove comments from any users


- [ ] **Notifications module**
    - [ ] Thinking about it 🤔


##  How to use :globe_with_meridians:

  Link to API : < not ready yet >
  Link to client : < not ready yet >

##  How to use :house:

Database:
`docker-compose up`

API Dev:
`npm run start:dev`

API Build
`npm run build`

API tests
`npm run test`

##  Author

👤 **Vinicius Kammradt**

* Website: https://kammradt.now.sh/

* Twitter: [@kammzinho](https://twitter.com/kammzinho)

* Github: [@kammradt](https://github.com/kammradt)

* LinkedIn: [@vinicius-kammradt](https://linkedin.com/in/vinicius-kammradt)
