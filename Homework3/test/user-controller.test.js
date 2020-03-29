const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);
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

	beforeAll((done) => {
		userService.getUserLoginDetails = jest.fn();
		userService.getUserLoginDetails.mockReturnValue(true);
		request
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

	it('should return Forbidden access ', async (done) => {
		const res = await request.get('/api/users');
		expect(res.statusCode).toEqual(403);
		done();
	});

	it('should return JWT token error ', async (done) => {
		const res = await request.get('/api/users').set('x-access-token', `${token}0`);
		expect(res.statusCode).toEqual(401);
		done();
	});
	it('should return User details ', async (done) => {
		userModal.findAll = jest.fn();
		userModal.findAll.mockReturnValue(users);
		const res = await request.get('/api/users').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(users);
		done();
	});
	it('should return User details by ID when user exist', async (done) => {
		userModal.findByPk = jest.fn();
		userModal.findByPk.mockReturnValue(users[0]);
		const res = await request.get('/api/users/:001').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(users[0]);
		done();
	});
	it('should return User details by ID when user does not exist', async (done) => {
		userModal.findByPk = jest.fn();
		userModal.findByPk.mockReturnValue(null);
		const res = await request.get('/api/users/:003').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(404);
		done();
	});
	// it('should insert new User', async (done) => {
	// 	userService.updateUserData = jest.fn();
	// 	userService.updateUserData.mockReturnValue([users[1]]);
	// 	const res = await request.put('/api/users/:003').set('x-access-token', `${token}`);
	// 	console.log(res);
	// 	expect(res.statusCode).toEqual(404);
	// 	done();
	// });
});