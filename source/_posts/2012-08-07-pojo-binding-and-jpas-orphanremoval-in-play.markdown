---
layout: post
title: "POJO binding and JPA's orphanRemoval in Play"
date: 2012-08-07 22:14
comments: true
categories: [ Play, JPA ]
---

The `orphanRemoval` property allows you to easily manage `OneToMany` and 
`OneToOne` relationships. If a relationship has `orphanRemoval` set to true, 
then whenever a child is removed from the parent entity it will also be deleted 
from the database.

But when used in combination with 
[Play's POJO binding](http://www.playframework.org/documentation/1.2.4/controllers#pojo), 
it can cause some unexpected errors. Consider the following example:

``` java
@Entity
public class Parent extends Model {
  @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
  List<Child> childs;
}
```

And our Controller:

``` java
public ParentController extends Controller {
  public static void update(Parent parent) {
    parent.merge();
    parent.save(); 
    render(parent);
  }
}
```

This will throw the following exception: 
`PersistenceException occured : org.hibernate.HibernateException: A collection 
with cascade="all-delete-orphan" was no longer referenced by the owning entity 
instance: models.Parent.childs`

### The problem
To make the `orphanRemoval` work Hibernate has to keep track of the Collection 
that is referencing the childs. When `update()` is called, the childs List is 
assigned a new instance, this is what causes the `PersistenceException`.

### The solution
We can easily solve this by providing a setter for `childs` which will prevent 
it from being assigned a new instance. Here is the fixed `Parent` model:

``` java
@Entity
public class Parent extends Model {
  @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
  List<Child> childs;

  public void setChilds(List<Child> newChilds) {
    this.childs.clear();
    if (newChilds != null) {
      this.childs.addAll(newChilds);
    }
  }
}
```

