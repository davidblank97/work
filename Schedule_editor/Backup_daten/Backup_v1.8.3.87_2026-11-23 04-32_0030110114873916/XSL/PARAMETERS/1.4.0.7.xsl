<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268242']">
    <param id="202677">
      <name>STEPPER 0 BRAKE</name>
      <short_name></short_name>
      <desc>An IO point that activates a brake that is used with stepper motors.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268243']">
    <param id="202678">
      <name>STEPPER 2 BRAKE</name>
      <short_name></short_name>
      <desc>An IO point that activates a brake that is used with stepper motors.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='265010']">
    <param id="265015">
      <name>MIG SENSITIVITY</name>
      <short_name/>
      <desc>The responsiveness of the algorithm that controls the output of the power supply for a MIG welding process. A type of welding process. Acronym for 'Metal Inert Gas' welding. Also known as GMAW welding.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='265009']">
    <param id="265014">
      <name>ACC</name>
      <short_name></short_name>
      <desc>ACC is an acronym for 'Automatic Current Control'.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268041']">
    <param id="268041">
      <name>GAS FLOW RATE</name>
      <short_name/>
      <desc>An IO point. Provides the system with an accurate measurement of the shield gas flow rate.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
        <param id="262887">
          <name>AUX 0 POSITION</name>
          <short_name></short_name>
          <desc>The measurement of the position of the weld head's AUX 0 axis.</desc>
        </param>
          <param id="262888">
          <name>AUX 1 POSITION</name>
          <short_name></short_name>
          <desc>The measurement of the position of the weld head's AUX 1 axis.</desc>
        </param>
        <param id="265011">
          <name>DETECT CLEAR SHORT OFFSET FROM BLAST</name>
          <short_name></short_name>
          <desc>N/A</desc>
        </param>
        <param id="265012">
          <name>START RAMP TO CLEAR SHORT OFFSET FROM BLAST</name>
          <short_name></short_name>
          <desc>N/A</desc>
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