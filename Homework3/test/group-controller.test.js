const request = require('supertest');
const { groupModal } = require('./../modals/groups/group-modal');
const userService = require('./../services/users/user-service');

const groups = [
    {
        "id": "001",
        "name": "admin",
        "permissions": [
            "READ",
            "WRITE",
            "DELETE",
            "SHARE",
            "UPLOAD_FILES"
        ]
    },
    {
        "id": "002",
        "name": "read_only",
        "permissions": [
            "READ"
        ]
    },
    {
        "id": "003",
        "name": "read_write",
        "permissions": [
            "READ",
            "WRITE"
        ]
	}
]

describe('Group Controller testing Endpoints', () => {

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

	it('should return Forbidden access ', async (done) => {
		const res = await request(app).get('/api/groups');
		expect(res.statusCode).toEqual(403);
		done();
	});

	it('should return group details ', async (done) => {
		groupModal.findAll = jest.fn();
		groupModal.findAll.mockReturnValue(groups);
		const res = await request(app).get('/api/groups').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(groups);
		done();
	});
	it('should return group details, throws an error ', async (done) => {
		groupModal.findAll = jest.fn();
		groupModal.findAll.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get('/api/groups').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(500);
		done();
	});

	it('should return group details by ID when user exist', async (done) => {
		groupModal.findByPk = jest.fn();
		groupModal.findByPk.mockReturnValue(groups[0]);
		const res = await request(app).get('/api/groups/:001').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(groups[0]);
		done();
	});
	it('should return group details by ID when user does not exist', async (done) => {
		groupModal.findByPk = jest.fn();
		groupModal.findByPk.mockReturnValue(null);
		const res = await request(app).get('/api/groups/:003').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should return groups details by ID , throws an error', async (done) => {
		groupModal.findByPk = jest.fn();
		groupModal.findByPk.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get('/api/groups/:003').set('x-access-token', `${token}`);
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should update groups details', async (done) => {
		groupModal.update = jest.fn();
		groupModal.update.mockReturnValue([groups[1]]);
		const res = await request(app).put('/api/groups/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "007",
				"name": "delete_only",
				"permissions": [
					"DELETE"
				]
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should update groups details but an id already already exist', async (done) => {
		groupModal.update = jest.fn();
		groupModal.update.mockReturnValue([0]);
		const res = await request(app).put('/api/groups/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "007",
				"name": "delete_only",
				"permissions": [
					"DELETE"
				]
			});
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should update group details but throws an error', async (done) => {
		groupModal.update = jest.fn();
		groupModal.update.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).put('/api/groups/:003')
			.set('x-access-token', `${token}`)
			.send({
				"id": "007",
				"name": "delete_only",
				"permissions": [
					"DELETE"
				]
			});
		expect(res.statusCode).toEqual(500);
		done();
	});
	it('should add new group', async (done) => {
		groupModal.create = jest.fn();
		groupModal.create.mockReturnValue();
		const res = await request(app).post('/api/addGroup')
			.set('x-access-token', `${token}`)
			.send({
				"id": "007",
				"name": "delete_only",
				"permissions": [
					"DELETE"
				]
			});
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should add new group, throws an error', async (done) => {
		groupModal.create = jest.fn();
		groupModal.create.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).post('/api/addGroup')
			.set('x-access-token', `${token}`)
			.send({
				"id": "007",
				"name": "delete_only",
				"permissions": [
					"DELETE"
				]
			});
		expect(res.statusCode).toEqual(422);
		done();
	});
	it('should delete a group', async (done) => {
		groupModal.destroy = jest.fn();
		groupModal.destroy.mockReturnValue(true);
		const res = await request(app).delete('/api/groups/:001')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(200);
		done();
	});
	it('should delete a group but id doesnot exist', async (done) => {
		groupModal.destroy = jest.fn();
		groupModal.destroy.mockReturnValue(false);
		const res = await request(app).delete('/api/groups/:008')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(404);
		done();
	});
	it('should delete a user but throws error', async (done) => {
		groupModal.destroy = jest.fn();
		groupModal.destroy.mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).delete('/api/groups/:008')
			.set('x-access-token', `${token}`);;
		expect(res.statusCode).toEqual(500);
		done();
	});
});