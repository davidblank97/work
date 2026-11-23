<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output  omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      	<param id="273664">
          <name>UPDATE DOWNLOAD PROGRESS</name>
          <short_name></short_name>
          <desc>N/A</desc>
        </param> 
        <param id="206850">
          <name>FIRE CONNECT LICENSE ENABLED</name>
          <short_name>FIRE CONNECT</short_name>
          <desc>Referring to enabling/disabling a FireConnect license.</desc>
        </param>
        <param id="331268">
          <name>SYSTEM FLEET ID</name>
          <short_name></short_name>
          <desc></desc>
        </param>
    </xsl:copy>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>