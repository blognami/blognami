
class Slick::Database::Migrator

    def initialize(database)
        @database = database

        if !database.slick_applied_migrations.exist?
            database.slick_applied_migrations.add_column(:schema_version, :integer) 
        end
    end

    def current_schema_version
        slick_applied_migration = @database.slick_applied_migrations.order_by(:schema_version, :desc).first
        if slick_applied_migration
            slick_applied_migration.schema_version
        else
            -1
        end
    end

    def latest_schema_version
        migrations.length > 0 ? migrations.last.schema_version : -1
    end

    def migrate()
        has_applied_any_migration = false

        migrations.each do |migration|
            next if migration_applied?(migration)
            puts "Applying migration: #{migration.name}"
            migration.new.migrate
            @database.slick_applied_migrations.insert(:schema_version => migration.schema_version)
            has_applied_any_migration = true  
        end

        puts "Migrations up-to-date" if !has_applied_any_migration
    end

    private

    def migrations
        @migrations ||= Slick::Database::Migration.registered_classes.values.sort do |a, b|
            a.schema_version <=> b.schema_version
        end
    end

    def migration_applied?(migration)
        @database.slick_applied_migrations.schema_version_eq(migration.schema_version).count > 0
    end

end
