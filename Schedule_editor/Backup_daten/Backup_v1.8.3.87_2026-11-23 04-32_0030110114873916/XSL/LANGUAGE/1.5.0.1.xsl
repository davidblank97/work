<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language/text[@id='500']">
    <xsl:copy-of select="."/>
	<text id="501">
      <content>FIRE CONNECT</content>
      <desc>Refers to the name of the data link unique to Liburdi Products.</desc>
	</text>
	<text id="502">
		<content>FIRE VIEW</content>
		<desc>Refers to the name of the vision system unique to Liburdi Products.</desc>
	</text>
	<text id="503">
		<content>MQTT</content>
		<desc>Refers to the name of a standard telemetry protocol. Stands for Message Query Telemetry Transport.</desc>
	</text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>