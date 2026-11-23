<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <param id="202679">
        <name>AUX POWER CONTACTOR STATUS</name>
        <short_name></short_name>
        <desc>An IO point that tells the status of the contactor used for auxiliary power supply.</desc>
      </param>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='263153']">
    <param id="262897">
      <name>OSC CENTRE POSITION</name>
      <short_name>OSC CENTRE POS.</short_name>
      <desc>OSC is short for 'Oscillation'. The position of the center point of the weld head's oscillation axis. The oscillator will oscillate around the center position. Changing the center position will steer the axis.</desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268264']">
    <param id="268264">
      <name>SERVO 0 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268265']">
    <param id="268265">
      <name>SERVO 1 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268266']">
    <param id="268266">
      <name>SERVO 2 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268267']">
    <param id="268267">
      <name>SERVO 3 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268268']">
    <param id="268268">
      <name>SERVO 4 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268269']">
    <param id="268269">
      <name>SERVO 5 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268270']">
    <param id="268270">
      <name>SERVO 6 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268271']">
    <param id="268271">
      <name>SERVO 7 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>
   <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='268272']">
    <param id="268272">
      <name>SERVO 8 OPEN LOOP DUTY</name>
      <short_name>OPEN LOOP DUTY</short_name>
      <desc></desc>
    </param>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>