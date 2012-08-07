---
layout: post
title: "JPA: The difference between merge() and persist()"
date: 2012-08-07 21:30
comments: true
categories: 
---

When I started developing in [Play! Framework](http://www.playframework.org/)
it was my first time developing in Java and using JPA. I got a bit confused when 
I needed to use `merge()` for the first time so I decided to write a 
bit about it to better my understanding of Play! and JPA.


Let's look at what the 
[official EntityManager documentation](http://docs.oracle.com/javaee/5/api/javax/persistence/EntityManager.html) 
says first.

> #### merge()
> `<T> T merge(T entity)`  
> Merge the state of the given entity into the current persistence context.

> #### persist()  
`void persist(Object entity)`  
Make an entity instance managed and persistent.


## The difference
As the documentation says `persist()` will make the entity instance managed and 
persistent, while `merge()` will just merge the state into the current 
persistence context. What this means is that both methods will add the entity 
to the persistence context, but `persist()` will also make the entity managed 
so that changes after the `persist()` call will also be persisted, whereas 
`merge()` will not do this (although it will return a managed entity instance).

## An example in Play! Framework
This is where I got confused. I thought calling `merge()` on my model would be 
sufficient, but Play manages JPA a bit differently. In Play! you have to 
[explicitly save](http://www.playframework.org/documentation/1.2.4/jpa#save) an 
object using `save()`. Play does this because it's more intuitive than having 
to call `refresh()` on entities. The `save()` method will then call `persist()` 
on the entity if needed, this is also why the models in Play don't have a 
`persist()` method.

A very basic example (without validation etc.)

#### Controller  

``` java
    public class Questions extends Controller {

      public static void update(Question question) {
        // Suppose the question contains some new answers
        question.merge();
        // Save! Otherwise the state of the question entity will be refreshed!
        question.save();  
        render(question);
      }

    }
```

#### Question Entity
    
``` java
    @Entity
    public class Question extends Model {

      @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
      public List<Answer> answers;

      // Other fields...
    }
```


## Resources
* [JPA implementation patterns: saving (detached) entities](http://blog.xebia.com/2009/03/23/jpa-implementation-patterns-saving-detached-entities/)
* [Why use persist() over merge()?](http://stackoverflow.com/questions/1069992/jpa-entitymanager-why-use-persist-over-merge)
