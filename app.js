const Koa = require('koa2');
const router = require('koa-router')();
var mysql = require('mysql');
var bodyParser = require('koa-bodyparser');
const app = new Koa();
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'test'
});
app.use(bodyParser());
let query = (sql) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, data) => {
			if (err) {
				resolve({
					message: err.message
				})
			}
			resolve(data);
		})
	})
}
//登录界面 
router.get('/', async (ctx, next) => {
	ctx.response.body = '<h1>欢迎查询</h1>'
})
// 获取数据列表
router.get('/get_user_list', async (ctx, next) => {
	let data;
	let sql = 'SELECT * from runoob_tbl';
	try {
		data = await query(sql)
		ctx.set('Access-Control-Allow-Origin', '*');
		ctx.body = data;
	} catch (error) {
		ctx.body = { message: error.message };
		ctx.status = error.status || 500;
	}

})
router.put('/update_user', async (ctx, next) => {
	var updateResult;
	var body = ctx.request.body;
	var _id = body.id,
		_title = body.runoob_title,
		_author = body.runoob_author;
	var sql = `UPDATE runoob_tbl SET runoob_title='${_title}', runoob_author='${_author}'  WHERE runoob_id=${_id}`;
	try {
		updateResult = await connection.query(sql, (error, result) => {
			if(error) throw error;
			return result;
		})
		if(updateResult){
			ctx.body = {
				success: true,
				message: `修改成功`
			}
		}else{
			ctx.body = {
				success: false,
				message: `修改失败`
			}
		}
	} catch (error) {
		console.log(error)
	}
})
// 删除
router.delete('/delete_user', async (ctx, next) => {
	var deleteResult;
	var body = ctx.request.body;
	var _id = body.id;
	var sql = `DELETE FROM runoob_tbl WHERE runoob_id=${_id}`
	try {
		deleteResult  = await connection.query(sql, function(error, result){
			if(error) throw error;
			return result
		})
		if(deleteResult){
			ctx.body = {
				success: true,
				message: `成功删除用户${_id}`
			}
		}else{
			ctx.body = {
				success: false,
				message: `删除失败`
			}
		}
	} catch (error) {
		console.log(error)
	}
})
// 增加数据
router.post('/add_user', async (ctx, next) => {
	// connection.connect();
	var addresult;
	var body = ctx.request.body;
	var _title = body.runoob_title,
		_author = body.runoob_author,
		_date = body.submission_date;
	var sql = `INSERT INTO runoob_tbl (runoob_title, runoob_author, submission_date) values ('${_title}', '${_author}', '${_date}')`;
	try {
		addresult = await connection.query(sql, function (error, result) {
			if (error) throw error;
			return result
		});
		ctx.set('Access-Control-Allow-Origin', '*');
		if (addresult) {
			ctx.body = {
				success: true,
				message: '插入成功'
			};
		}else{
			ctx.body = {
				success: false,
				message: '插入失败'
			};
		}
	} catch (error) {
		console.log(error)
	}
	// connection.end();
})
app.use(require('koa-static')(__dirname));
app.use(router.routes())
app.listen(3000, () => {
	console.log('server is running at http://localhost:3000')
})