---
layout: post
title: "FQL RubyGem"
date: 2012-10-24 21:44
comments: true
categories: [ Ruby, FQL ]
---

The Facebook Query Language allows you to write SQL-like queries to fetch data 
from the Graph API. I've written a simple gem named `fql` to simplify this in 
ruby.

First of all install the gem by adding `gem 'fql'` to your `Gemfile`.

Now you can simply use the FQL queries like so:

``` ruby
    Fql.execute('SELECT first_name, last_name FROM user WHERE uid = 4')
```

And it will return the matching records as an array of hashes:

```ruby Single query result
  [{"first_name"=>"Mark", "last_name"=>"Zuckerberg"}]
```

### Using an access token

To access some resources you'll need to have a valid access token.

``` ruby
    Fql.execute('SELECT first_name, last_name FROM user WHERE uid = me()', 
                :access_token => 'abc1234567')
```

### Using a multi-query

If you want to use multi-queries then just pass in a Hash instead of a string.

``` ruby
    Fql.execute({
      "query1" => "SELECT uid, rsvp_status FROM event_member WHERE eid = 209798352393506 LIMIT 3",
      "query2" => "SELECT name FROM user WHERE uid IN (SELECT uid FROM #query1)"
    }, :access_token => "abc1234567")
```

Note that the result will be a bit different from that of a single query. It 
will still return an array of hashes, but this time the hashes will have a 
`name` and `fql_result_set` key.   
The `name` is the name of the subquery and `fql_result_set` will contains the 
results for that particular query.

```ruby Multi-query result example
  [
    {
      "name" => "query1", 
      "fql_result_set" => [{"uid"=>712638919, "rsvp_status"=>"attending"}, ... ]
    }, 
    {
      "name"=>"query2", 
      "fql_result_set"=>[{"name"=>"Srikanth Nagandla"}, ... ]
    }
  ]
```

For more information on how the use FQL you can check out the 
[official developer documentation](https://developers.facebook.com/docs/reference/fql/).
