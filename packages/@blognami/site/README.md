# @blognami/site

Implements site functionality in the main app.

## Features

- **Site Model**: Core site entity with password generation and verification
- **Site Management**: Admin views for editing site metadata, description, and legal pages
- **Legal Pages**: Terms of Service, Privacy Policy, and Cookie Policy pages
- **Site Settings**: Menu integration for site configuration in admin interface

## Models

- `Site`: Singleton model for site configuration with revisioning support

## Views

### Admin Actions
- Edit site metadata (title)
- Edit site description (with markdown editor and revision history)
- Edit legal pages (Terms of Service, Privacy Policy, Cookie Policy)

### Legal Pages
- Terms of Service page
- Privacy Policy page  
- Cookie Policy page

## Services

- `Menus`: Provides site-related menu items for admin settings and legal footer links

## Dependencies

- `@blognami/main`: Core functionality and base classes

## Usage

This package is automatically imported by `@blognami/pages` and `@blognami/posts` to provide site functionality throughout the application.