
<!--
  
  NOTE: The file versions for the USER file got messed up in the transition between versioning conventions.
        The file version was incremented to v1.5.0.0 in build v1.4. Incrementing to v1.5.1.0 here so that
        XSLs work, however it is the first file revision released for v1.5.
  
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output  omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="user_security">
    <user_security fleet_id="">
      <xsl:apply-templates select="@*|node()"/>
    </user_security>
  </xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>