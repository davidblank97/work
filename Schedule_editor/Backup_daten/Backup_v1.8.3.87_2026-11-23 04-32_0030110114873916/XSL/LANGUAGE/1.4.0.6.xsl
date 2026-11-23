<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language[@localeID='en-CA']/text[@id='1048578']">
    <text id="1048578">
      <content>Units of measure have changed. Do you want to make these changes permanent? </content>
      <desc>Message text asking the user to save changes made to the user units.</desc>
    </text>
  </xsl:template> 
  
  <xsl:template match="language[@localeID='en-CA']/text[@id='65586']">
	<text id="65586">
		<content>Update Parameters: MIG</content>
		<desc>Description of a step in a welding procedure. Updating the welder with new parameters for a segment in the weld schedule.</desc>
	</text>
  </xsl:template>
  
  <xsl:template match="language[@localeID='en-CA']/text[@id='65587']">
	<text id="65587">
		<content>Update Parameters: TIG</content>
		<desc>Description of a step in a welding procedure. Updating the welder with new parameters for a segment in the weld schedule.</desc>
	</text>
  </xsl:template> 

  <xsl:template match="language[@localeID='en-CA']/text[@id='460']">
    <xsl:copy-of select="."/>
    <text id="461">
      <content>PLASMA FLOW</content>
      <desc>Refers to the flow of Plasma Gas used for welding.</desc>
    </text>
    <text id="462">
      <content>TRAIL FLOW</content>
      <desc>Refers to the flow of Trail Gas used for welding.</desc>
    </text>
    <text id="463">
      <content>CURRENT SCHEDULE</content>
      <desc>Refers to the schedule that is currently loaded.</desc>
    </text>
    <text id="464">
      <content>LOOP</content>
      <desc>Refers to a loop index.</desc>
	  </text>
    <text id="465">
      <content>SELECT ALL</content>
      <desc>Refers to selecting all items in a list.</desc>
	  </text>
    <text id="466">
      <content>UNSELECT ALL</content>
      <desc>Refers to unselecting all items in a list.</desc>
	  </text>
    <text id="467">
      <content>CURRENT TELEMETRY</content>
      <desc>Refers to a measured current value.</desc>
    </text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>