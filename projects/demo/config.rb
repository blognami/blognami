

if ENV["DATABASE_ADAPTER"] == 'mysql'
  { 
    database: {
      adapter: "mysql",
      username: "root",
      password: "",
      name: "demo_#{environment}"
    }
  }
else
  { 
    database: {
      adapter: "sqlite",
      filename: "#{project.root_path}/demo_#{environment}.db"
    }
  }
end
