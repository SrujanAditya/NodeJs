const request = require('supertest');
const { userModal } = require('./../modals/users/user-modal');
const userService = require('./../services/users/user-service');

const users = [
	{
		"id": "001",
		"login": "admin@gmail.com",
		"password": "$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga",
		"age": 22,
		"isDeleted": false
	},
	{
		"id": "002",
		"login": "samp@gmail.com",
		"password": "$2b$10$fVREBieaUKxmEXaK.mGO3eyHVoqcVBtmprIkKklEAqgbKbzbDAKga",
		"age": 23,
		"isDeleted": false
	}
];
describe('USER Controller testing Endpoints', () => {

	let token;
	let app;

	beforeAll((done) => {
		app = require('../index');
		userService.getUserLoginDetails = jest.fn();
		userService.getUserLoginDetails.mockReturnValue(true);
		request(app)
			.post('/api/login')
			.send({
				login: 'admin@gmail.com',
				password: 'password',
			})
			.end((err, response) => {
				token = response.body.access_token; // save the token!
				done();
			});
	});
	afterAll(done => {
		request.close();
		done();
	})

	it('should return a valid JWT token', async (done) => {
		userService.getUserLoginDetails.mockReturnValue(true);
		const res = await request(app).post('/api/login')
			.send({
				login: 'admin@gmail.com',
				password: 'password',
			});
		expect(res.statusCode).toEqual(200);
		done();
	});

	it('should return invalid credentials error', async (done) => {
		userService.getUserLoginDetails.mockReturnValue(false);
		const res = await request(app).post('/api/login')
			.send({
				login: 'admin@gmail.com',
				password: 'password',
			});
		expect(res.statusCode).toEqual(401);
		done();
	});

	it('should return invalid credentials error, throw an error', async (done) => {
		userService.getUserLoginDetails.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).post('/api/login')
			.send({
				login: 'admin@gmail.com',
				password: 'password',
			});
		expect(res.statusCode).toEqual(500);
		done();
	});

	it('should return Forbidden access ', async (done) => {
		const res = await request(app).get('/api/users');
		expect(res.statusCode).toEqual(403);
		done();
	});

	it('should return JWT token error ', async (done) => {
		const res = await request(app).get('/api/users').set('x-access-token', `${token}0`);
		expect(res.statusCode).toEqual(401);
		done();
	});
	it('should return User details ', async (done) => {
		userModal.findAll = jest.fn();
		userModal.findAll.mockReturnValue(users);
		const res = await request(app).get('/api/users').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(users);
		done();
	});
	it('should return User details, throws an error ', async (done) => {
		userModal.findAll = jest.fn();
		userModal.findAll.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get('/api/users').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should return User details by ID when user exist', async (done) => {
		userModal.findByPk = jest.fn();
		userModal.findByPk.mockReturnValue(users[0]);
		const res = await request(app).get('/api/users/:001').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(users[0]);
		done();
	});
	it('should return User details by ID when user does not exist', async (done) => {
		userModal.findByPk = jest.fn();
		userModal.findByPk.mockReturnValue(null);
		const res = await request(app).get('/api/users/:003').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should return User details by ID , throws an error', async (done) => {
		userModal.findByPk = jest.fn();
		userModal.findByPk.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get('/api/users/:003').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should update user details', async (done) => {
		userService.updateUserData = jest.fn();
		userService.updateUserData.mockReturnValue([users[1]]);
		const res = await request(app).put('/api/users/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should update user details but an id already already exist', async (done) => {
		userService.updateUserData = jest.fn();
		userService.updateUserData.mockReturnValue([]);
		const res = await request(app).put('/api/users/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should update user details but throws an error', async (done) => {
		userService.updateUserData = jest.fn();
		userService.updateUserData.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).put('/api/users/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should add new user', async (done) => {
		userService.addUser = jest.fn();
		userService.addUser.mockReturnValue();
		const res = await request(app).post('/api/addUser')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should add new user', async (done) => {
		userService.addUser = jest.fn();
		userService.addUser.mockReturnValue();
		const res = await request(app).post('/api/addUser')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should add new user, throws an error', async (done) => {
		userService.addUser = jest.fn();
		userService.addUser.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).post('/api/addUser')
			.set('x-access-token', `${token}`)
			.send({
				"id": "006",
				"login": "admin4@gmail.com",
				"password": "password",
				"age": 22
			});
		expect(res.statusCode).toEqual(422);
		done();
	});
	it('should delete a user', async (done) => {
		userModal.update = jest.fn();
		userModal.update.mockReturnValue(true);
		const res = await request(app).delete('/api/users/:001')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should delete a user but id doesnot exist', async (done) => {
		userModal.update = jest.fn();
		userModal.update.mockReturnValue(false);
		const res = await request(app).delete('/api/users/:008')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should delete a user but throws error', async (done) => {
		userModal.update = jest.fn();
		userModal.update.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).delete('/api/users/:008')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should return autosuggest details', async (done) => {
		userModal.findAll = jest.fn();
		userModal.findAll.mockReturnValue(true);
		const res = await request(app).get('/api/autoSuggest').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should return autosuggest details, throws error', async (done) => {
		userModal.findAll = jest.fn();
		userModal.findAll.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get('/api/autoSuggest').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should add users to group', async (done) => {
		userService.addUsersToGroup = jest.fn();
		userService.addUsersToGroup.mockReturnValue(true);
		const res = await request(app).post('/api/addUserToGroup')
			.set('x-access-token', `${token}`)
			.send({
				"groupId": "001",
				"userIds": ["002", "003"]
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should add users to group, failed to add', async (done) => {
		userService.addUsersToGroup = jest.fn();
		userService.addUsersToGroup.mockReturnValue(false);
		const res = await request(app).post('/api/addUserToGroup')
			.set('x-access-token', `${token}`)
			.send({
				"groupId": "001",
				"userIds": ["002", "003"]
			});
		expect(res.statusCode).toEqual(409);
		done();
	});
	it('should add users to group, throws error', async (done) => {
		userService.addUsersToGroup = jest.fn();
		userService.addUsersToGroup.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).post('/api/addUserToGroup')
			.set('x-access-token', `${token}`)
			.send({
				"groupId": "001",
				"userIds": ["002", "003"]
			});
		expect(res.statusCode).toEqual(500);
		done();
	});
});