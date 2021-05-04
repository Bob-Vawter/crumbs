const Post = require('../models/Post')

module.exports = {
  getFeed: async (req,res)=>{
    try{
      const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .lean()
      console.log(posts)
      res.render('feed.ejs', {posts: posts, user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  getPost: async (req,res)=>{
    try{
      const post = await Post.findById(req.params.id)
      res.render('post.ejs', {post: post, user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  createPost: async (req, res)=>{
    console.log(req.body)
    try{
      req.file.filename
      var imageExists = true
    }catch(err){
      var imageExists = false
    }
    try{
      if(imageExists){
        await Post.create({
          crumb: req.body.crumb,
          image: '/uploads/' + req.file.filename,
          likes: 0,
          user: req.user.id,
          userName: req.user.userName
        })
      } else {
        await Post.create({
          crumb: req.body.crumb,
          //image: '/uploads/' + req.file.filename,
          likes: 0,
          user: req.user.id,
          userName: req.user.userName
        })
      }
      console.log('Post has been added!')
      res.redirect('/profile')
    }catch(err){
      console.log(err)
      res.redirect('/profile')
    }
  },
  likePost: async (req, res)=>{
    try{
      await Post.findOneAndUpdate({_id:req.params.id},
        {
          $inc : {'likes' : 1}
        })
        console.log('Likes +1')
        res.redirect(`/post/${req.params.id}`)
      }catch(err){
        console.log(err)
      }
    },
    deletePost: async (req, res)=>{
      try{
        console.log(req.params)
        await Post.findOneAndDelete({_id:req.params.id})
        console.log('Deleted Post')
        res.redirect('/profile')
      }catch(err){
        res.redirect('/profile')
      }
    }
  }
